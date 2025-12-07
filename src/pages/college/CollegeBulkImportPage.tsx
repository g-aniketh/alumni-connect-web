import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import { collegeAPI } from "../../lib/api";
import { Upload, CheckCircle2, Download, AlertCircle } from "lucide-react";

type ImportType = "students" | "alumni";

const CollegeBulkImportPage = () => {
  const [importType, setImportType] = useState<ImportType>("students");
  const [csvData, setCsvData] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<{
    created: number;
    message: string;
  } | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setCsvData(text);
      setError("");
      setSuccess(null);
      setValidationErrors([]);
    };
    reader.readAsText(file);
  };

  const downloadTemplate = () => {
    const template =
      importType === "students"
        ? `name,email,password,rollNumber,enrollmentYear,department,degree,graduationYear
John Doe,john.doe@example.com,password123,CS21B001,2021,Computer Science,B.Tech,2025
Jane Smith,jane.smith@example.com,password123,EE21B002,2021,Electrical Engineering,B.Tech,2025`
        : `name,email,password,graduationYear,degree,department,currentJobTitle,company,linkedInProfile
John Doe,john.doe@example.com,password123,2020,Computer Science,B.Tech,Software Engineer,Google,https://linkedin.com/in/johndoe
Jane Smith,jane.smith@example.com,password123,2019,Electrical Engineering,B.Tech,Senior Engineer,Microsoft,https://linkedin.com/in/janesmith`;

    const blob = new Blob([template], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${importType}_bulk_import_template.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const parseCSV = (csvText: string): string[][] => {
    const lines = csvText.trim().split("\n");
    return lines.map((line) => {
      const values: string[] = [];
      let current = "";
      let inQuotes = false;

      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === "," && !inQuotes) {
          values.push(current.trim());
          current = "";
        } else {
          current += char;
        }
      }
      values.push(current.trim());
      return values;
    });
  };

  type StudentRowData = {
    name: string;
    email: string;
    password?: string;
    rollNumber: string;
    enrollmentYear: number;
    department: string;
    degree: string;
    graduationYear: number;
  };

  type AlumniRowData = {
    name: string;
    email: string;
    password?: string;
    graduationYear: number;
    degree: string;
    department: string;
    currentJobTitle?: string;
    company?: string;
    linkedInProfile?: string;
    skills?: string[];
  };

  const validateAndParseData = (): {
    valid: boolean;
    data: StudentRowData[] | AlumniRowData[];
    errors: string[];
  } => {
    const errors: string[] = [];
    const lines = parseCSV(csvData);

    if (lines.length < 2) {
      errors.push("CSV must have at least a header row and one data row");
      return { valid: false, data: [], errors };
    }

    const headers = lines[0].map((h) => h.toLowerCase().trim());
    const dataRows = lines.slice(1);

    if (importType === "students") {
      const parsedData: StudentRowData[] = [];
      const requiredFields = [
        "name",
        "email",
        "rollnumber",
        "enrollmentyear",
        "department",
        "degree",
        "graduationyear",
      ];
      const missingFields = requiredFields.filter((f) => !headers.includes(f));
      if (missingFields.length > 0) {
        errors.push(`Missing required columns: ${missingFields.join(", ")}`);
        return { valid: false, data: [], errors };
      }

      dataRows.forEach((row, index) => {
        const rowNum = index + 2; // +2 because we start from row 2 (after header)
        const rowData: StudentRowData = {
          name: "",
          email: "",
          rollNumber: "",
          enrollmentYear: 0,
          department: "",
          degree: "",
          graduationYear: 0,
        };

        headers.forEach((header, colIndex) => {
          const value = row[colIndex]?.trim() || "";
          switch (header) {
            case "name":
              if (!value) errors.push(`Row ${rowNum}: Name is required`);
              rowData.name = value;
              break;
            case "email":
              if (!value || !value.includes("@"))
                errors.push(`Row ${rowNum}: Valid email is required`);
              rowData.email = value;
              break;
            case "password":
              rowData.password = value || undefined;
              break;
            case "rollnumber":
              if (!value) errors.push(`Row ${rowNum}: Roll number is required`);
              rowData.rollNumber = value;
              break;
            case "enrollmentyear": {
              const enrollYear = parseInt(value, 10);
              if (isNaN(enrollYear))
                errors.push(`Row ${rowNum}: Valid enrollment year is required`);
              rowData.enrollmentYear = enrollYear;
              break;
            }
            case "department":
              if (!value) errors.push(`Row ${rowNum}: Department is required`);
              rowData.department = value;
              break;
            case "degree":
              if (!value) errors.push(`Row ${rowNum}: Degree is required`);
              rowData.degree = value;
              break;
            case "graduationyear": {
              const gradYear = parseInt(value, 10);
              if (isNaN(gradYear))
                errors.push(`Row ${rowNum}: Valid graduation year is required`);
              rowData.graduationYear = gradYear;
              break;
            }
          }
        });

        if (Object.keys(rowData).length > 0) {
          parsedData.push(rowData);
        }
      });

      return { valid: errors.length === 0, data: parsedData, errors };
    } else {
      // Alumni
      const parsedData: AlumniRowData[] = [];
      const requiredFields = [
        "name",
        "email",
        "graduationyear",
        "degree",
        "department",
      ];
      const missingFields = requiredFields.filter((f) => !headers.includes(f));
      if (missingFields.length > 0) {
        errors.push(`Missing required columns: ${missingFields.join(", ")}`);
        return { valid: false, data: [], errors };
      }

      dataRows.forEach((row, index) => {
        const rowNum = index + 2;
        const rowData: AlumniRowData = {
          name: "",
          email: "",
          graduationYear: 0,
          degree: "",
          department: "",
        };

        headers.forEach((header, colIndex) => {
          const value = row[colIndex]?.trim() || "";
          switch (header) {
            case "name":
              if (!value) errors.push(`Row ${rowNum}: Name is required`);
              rowData.name = value;
              break;
            case "email":
              if (!value || !value.includes("@"))
                errors.push(`Row ${rowNum}: Valid email is required`);
              rowData.email = value;
              break;
            case "password":
              rowData.password = value || undefined;
              break;
            case "graduationyear": {
              const gradYear = parseInt(value, 10);
              if (isNaN(gradYear))
                errors.push(`Row ${rowNum}: Valid graduation year is required`);
              rowData.graduationYear = gradYear;
              break;
            }
            case "degree":
              if (!value) errors.push(`Row ${rowNum}: Degree is required`);
              rowData.degree = value;
              break;
            case "department":
              if (!value) errors.push(`Row ${rowNum}: Department is required`);
              rowData.department = value;
              break;
            case "currentjobtitle":
              rowData.currentJobTitle = value || undefined;
              break;
            case "company":
              rowData.company = value || undefined;
              break;
            case "linkedinprofile":
              rowData.linkedInProfile = value || undefined;
              break;
            case "skills":
              rowData.skills = value
                ? value
                    .split(",")
                    .map((s) => s.trim())
                    .filter((s) => s)
                : undefined;
              break;
          }
        });

        if (Object.keys(rowData).length > 0) {
          parsedData.push(rowData);
        }
      });

      return { valid: errors.length === 0, data: parsedData, errors };
    }
  };

  const handleImport = async () => {
    setError("");
    setSuccess(null);
    setValidationErrors([]);

    if (!csvData.trim()) {
      setError("Please upload a CSV file or paste CSV data");
      return;
    }

    const validation = validateAndParseData();
    if (!validation.valid) {
      setValidationErrors(validation.errors);
      setError("Please fix the validation errors before importing");
      return;
    }

    setLoading(true);

    try {
      if (importType === "students") {
        const result = await collegeAPI.addStudentsBulk({
          students: validation.data as StudentRowData[],
        });
        setSuccess({ created: result.created, message: result.message });
        setCsvData("");
      } else {
        const result = await collegeAPI.addAlumniBulk({
          alumni: validation.data as AlumniRowData[],
        });
        setSuccess({ created: result.created, message: result.message });
        setCsvData("");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to import data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8 max-w-4xl space-y-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Bulk Import</h1>
          <p className="text-muted-foreground">
            Import multiple students or alumni at once using a CSV file.
          </p>
        </div>

        <Tabs
          value={importType}
          onValueChange={(v) => setImportType(v as ImportType)}
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="students">Import Students</TabsTrigger>
            <TabsTrigger value="alumni">Import Alumni</TabsTrigger>
          </TabsList>

          <TabsContent value="students" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Import Students</CardTitle>
                <CardDescription>
                  Upload a CSV file with student data. All imported students
                  will be automatically verified and linked to your college.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>CSV Template</Label>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" onClick={downloadTemplate}>
                      <Download className="h-4 w-4 mr-2" />
                      Download Template
                    </Button>
                    <p className="text-sm text-muted-foreground">
                      Required columns: name, email, rollNumber, enrollmentYear,
                      department, degree, graduationYear
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="file-upload">Upload CSV File</Label>
                  <Input
                    id="file-upload"
                    type="file"
                    accept=".csv"
                    onChange={handleFileUpload}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="csv-data">Or Paste CSV Data</Label>
                  <Textarea
                    id="csv-data"
                    placeholder="Paste CSV data here..."
                    value={csvData}
                    onChange={(e) => setCsvData(e.target.value)}
                    rows={10}
                    className="font-mono text-sm"
                  />
                </div>

                {validationErrors.length > 0 && (
                  <div className="p-4 border border-red-200 bg-red-50 dark:bg-red-950 rounded-md">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertCircle className="h-4 w-4 text-red-600" />
                      <h4 className="font-medium text-red-900 dark:text-red-100">
                        Validation Errors
                      </h4>
                    </div>
                    <ul className="list-disc list-inside space-y-1 text-sm text-red-700 dark:text-red-300">
                      {validationErrors.map((err, idx) => (
                        <li key={idx}>{err}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {error && (
                  <div className="p-4 border border-red-200 bg-red-50 dark:bg-red-950 rounded-md text-red-700 dark:text-red-300">
                    {error}
                  </div>
                )}

                {success && (
                  <div className="p-4 border border-green-200 bg-green-50 dark:bg-green-950 rounded-md">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      <h4 className="font-medium text-green-900 dark:text-green-100">
                        Import Successful
                      </h4>
                    </div>
                    <p className="text-sm text-green-700 dark:text-green-300">
                      {success.message}. Created {success.created} {importType}.
                    </p>
                  </div>
                )}

                <Button
                  onClick={handleImport}
                  disabled={loading || !csvData.trim()}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {loading ? "Importing..." : "Import Students"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="alumni" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Import Alumni</CardTitle>
                <CardDescription>
                  Upload a CSV file with alumni data. All imported alumni will
                  be automatically verified and linked to your college.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>CSV Template</Label>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" onClick={downloadTemplate}>
                      <Download className="h-4 w-4 mr-2" />
                      Download Template
                    </Button>
                    <p className="text-sm text-muted-foreground">
                      Required columns: name, email, graduationYear, degree,
                      department
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="file-upload-alumni">Upload CSV File</Label>
                  <Input
                    id="file-upload-alumni"
                    type="file"
                    accept=".csv"
                    onChange={handleFileUpload}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="csv-data-alumni">Or Paste CSV Data</Label>
                  <Textarea
                    id="csv-data-alumni"
                    placeholder="Paste CSV data here..."
                    value={csvData}
                    onChange={(e) => setCsvData(e.target.value)}
                    rows={10}
                    className="font-mono text-sm"
                  />
                </div>

                {validationErrors.length > 0 && (
                  <div className="p-4 border border-red-200 bg-red-50 dark:bg-red-950 rounded-md">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertCircle className="h-4 w-4 text-red-600" />
                      <h4 className="font-medium text-red-900 dark:text-red-100">
                        Validation Errors
                      </h4>
                    </div>
                    <ul className="list-disc list-inside space-y-1 text-sm text-red-700 dark:text-red-300">
                      {validationErrors.map((err, idx) => (
                        <li key={idx}>{err}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {error && (
                  <div className="p-4 border border-red-200 bg-red-50 dark:bg-red-950 rounded-md text-red-700 dark:text-red-300">
                    {error}
                  </div>
                )}

                {success && (
                  <div className="p-4 border border-green-200 bg-green-50 dark:bg-green-950 rounded-md">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      <h4 className="font-medium text-green-900 dark:text-green-100">
                        Import Successful
                      </h4>
                    </div>
                    <p className="text-sm text-green-700 dark:text-green-300">
                      {success.message}. Created {success.created} {importType}.
                    </p>
                  </div>
                )}

                <Button
                  onClick={handleImport}
                  disabled={loading || !csvData.trim()}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {loading ? "Importing..." : "Import Alumni"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CollegeBulkImportPage;
