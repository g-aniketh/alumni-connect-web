import { useState, useRef, useEffect, useMemo } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Badge } from "../ui/badge";
import { X } from "lucide-react";

interface SkillsAutocompleteProps {
  skills: string[];
  selectedSkills: string[];
  onSkillsChange: (skills: string[]) => void;
  label?: string;
  required?: boolean;
}

export const SkillsAutocomplete = ({
  skills,
  selectedSkills,
  onSkillsChange,
  label = "Skills",
  required = false,
}: SkillsAutocompleteProps) => {
  const [inputValue, setInputValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Use useMemo to compute filtered skills - show all unselected skills when input is empty
  const filteredSkills = useMemo(() => {
    const unselectedSkills = skills.filter(
      (skill) => !selectedSkills.includes(skill)
    );

    if (!inputValue.trim()) {
      // When input is empty, show all unselected skills (limit to 10 for performance)
      return unselectedSkills.slice(0, 10);
    }

    // Filter by input value
    return unselectedSkills.filter((skill) =>
      skill.toLowerCase().includes(inputValue.toLowerCase())
    );
  }, [inputValue, skills, selectedSkills]);

  // Show dropdown when there are filtered skills and (dropdown is open OR user is typing)
  // This ensures dropdown shows immediately when typing starts
  const shouldShowDropdown =
    filteredSkills.length > 0 && (isOpen || inputValue.trim().length > 0);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectSkill = (skill: string) => {
    if (!selectedSkills.includes(skill)) {
      onSkillsChange([...selectedSkills, skill]);
    }
    setInputValue("");
    setIsOpen(false);
    inputRef.current?.focus();
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    onSkillsChange(selectedSkills.filter((skill) => skill !== skillToRemove));
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      // If there are filtered skills, select the first one
      if (filteredSkills.length > 0) {
        handleSelectSkill(filteredSkills[0]);
      } else if (inputValue.trim()) {
        // If user typed something that doesn't match, try to find exact match
        const exactMatch = skills.find(
          (skill) =>
            skill.toLowerCase() === inputValue.toLowerCase() &&
            !selectedSkills.includes(skill)
        );
        if (exactMatch) {
          handleSelectSkill(exactMatch);
        }
      }
    } else if (e.key === "Escape") {
      setIsOpen(false);
    } else if (e.key === "ArrowDown" && filteredSkills.length > 0) {
      e.preventDefault();
      // Focus first item in dropdown (optional enhancement)
      setIsOpen(true);
    }
  };

  return (
    <div className="space-y-2 relative">
      <Label htmlFor="skills">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      <div className="relative">
        <Input
          id="skills"
          ref={inputRef}
          type="text"
          placeholder="Type a skill name to see suggestions..."
          value={inputValue}
          onChange={(e) => {
            const newValue = e.target.value;
            setInputValue(newValue);
            // Always open dropdown when typing - filteredSkills will update via useMemo
            setIsOpen(true);
          }}
          onFocus={() => {
            // Always open dropdown when input is focused to show available skills
            // filteredSkills is already computed via useMemo and will show suggestions
            setIsOpen(true);
          }}
          onBlur={(e) => {
            // Don't close if clicking on dropdown
            if (dropdownRef.current?.contains(e.relatedTarget as Node)) {
              return;
            }
            // Delay closing to allow click on dropdown items
            setTimeout(() => setIsOpen(false), 200);
          }}
          onKeyDown={handleInputKeyDown}
          className="w-full"
        />
        {shouldShowDropdown && (
          <div
            ref={dropdownRef}
            className="absolute z-50 w-full mt-1 bg-background border border-border rounded-md shadow-lg max-h-60 overflow-auto"
            onMouseDown={(e) => {
              // Prevent input blur when interacting with dropdown
              e.preventDefault();
            }}
          >
            {filteredSkills.map((skill) => (
              <button
                key={skill}
                type="button"
                onMouseDown={(e) => {
                  // Prevent input blur when clicking dropdown item
                  e.preventDefault();
                }}
                onClick={() => {
                  handleSelectSkill(skill);
                }}
                className="w-full text-left px-4 py-2 hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none transition-colors cursor-pointer"
              >
                {skill}
              </button>
            ))}
          </div>
        )}
      </div>
      {selectedSkills.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {selectedSkills.map((skill) => (
            <Badge
              key={skill}
              variant="secondary"
              className="px-3 py-1 text-sm flex items-center gap-1.5"
            >
              {skill}
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  handleRemoveSkill(skill);
                }}
                className="ml-1.5 hover:bg-transparent rounded-sm opacity-70 hover:opacity-100 transition-opacity"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};
