// Map frontend degree display to backend enum values
export const degreeMap: Record<string, string> = {
  "B.Tech": "bachelors",
  "M.Tech": "masters",
  "B.Sc": "bachelors",
  "M.Sc": "masters",
  MBA: "masters",
  PhD: "phd",
};

export const degrees = ["B.Tech", "M.Tech", "B.Sc", "M.Sc", "MBA", "PhD"];

// Map frontend department display to backend enum values
export const departmentMap: Record<string, string> = {
  "Computer Science": "computer_science",
  "Electrical Engineering": "electrical_engineering",
  "Mechanical Engineering": "mechanical_engineering",
  "Civil Engineering": "civil_engineering",
  Business: "business_administration",
  Arts: "arts",
  Science: "science",
};
