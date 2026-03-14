export const githubIssueSchema = {
  entity: "github_issue",
  version: "1.0",
  description:
    "Schema for a GitHub issue with repository context, issue metadata, labels, milestones, projects, and linked issue relationships.",

  core: {
    project: {
      type: "string",
      input_type: "dropdown",
      required: true,
      description:
        "GitHub repository where the issue belongs, usually in owner/repository format.",
      examples: ["octocat/Hello-World", "acme/platform"],
      allow_custom_values: true,
    },

    issue_number: {
      type: "string",
      input_type: "text",
      required: false,
      auto_populated: true,
      description:
        "GitHub issue number or identifier, if the issue already exists.",
      examples: ["123", "#456"],
    },

    title: {
      type: "string",
      input_type: "text",
      required: true,
      description: "Short title describing the issue.",
    },

    description: {
      type: "string",
      input_type: "rich_text",
      required: false,
      description:
        "Main issue body written in Markdown, including problem statement, steps, context, or expected outcome.",
    },

    assignee: {
      type: "user",
      input_type: "user_selector",
      required: false,
      description:
        "Primary assignee responsible for the issue. GitHub can support multiple assignees, but this field stores the main visible assignee.",
    },

    state: {
      type: "string",
      input_type: "dropdown",
      required: false,
      description: "Current GitHub issue state.",
      allowed_values: ["Open", "Closed"],
      allow_custom_values: false,
    },

    creator: {
      type: "user",
      input_type: "user_selector",
      required: false,
      auto_populated: true,
      description: "GitHub user who created the issue.",
    },

    created_date: {
      type: "datetime",
      input_type: "date_picker",
      required: false,
      auto_populated: true,
      description: "Date and time when the issue was created.",
    },

    changed_date: {
      type: "datetime",
      input_type: "date_picker",
      required: false,
      auto_populated: true,
      description: "Date and time when the issue was last updated.",
    },

    attachments: {
      type: "array",
      input_type: "file_upload",
      required: false,
      items: {
        type: "file",
      },
      description:
        "Files or image attachments referenced in the issue body or comments.",
    },
  },

  relationships: {
    parent: {
      type: "string",
      input_type: "issue_selector",
      required: false,
      description:
        "Parent issue or higher-level tracking issue if GitHub issue hierarchy is used.",
    },

    linked_issues: {
      type: "array",
      input_type: "relationship_selector",
      required: false,
      description:
        "References to other GitHub issues that are related, blocked, duplicated, or otherwise linked.",
      items: {
        type: "object",
        properties: {
          relation_type: {
            type: "string",
            allowed_values: [
              "relates to",
              "blocks",
              "blocked by",
              "duplicate",
              "duplicate of",
              "tracked by",
              "part of",
            ],
          },
          issue_number: {
            type: "string",
          },
          title: {
            type: "string",
          },
        },
      },
    },
  },

  custom_fields: {
    labels: {
      type: "array",
      input_type: "tag_selector",
      required: false,
      items: {
        type: "string",
      },
      description: "Labels applied to the issue.",
    },

    milestone: {
      type: "string",
      input_type: "dropdown",
      required: false,
      description:
        "Milestone associated with the issue, if any.",
      allow_custom_values: true,
    },

    projects: {
      type: "array",
      input_type: "tag_selector",
      required: false,
      items: {
        type: "string",
      },
      description:
        "GitHub Projects or project views the issue is associated with.",
    },

    issue_type: {
      type: "string",
      input_type: "dropdown",
      required: false,
      description:
        "Optional issue type if the repository uses GitHub issue types or equivalent labeling conventions.",
      allowed_values: ["Bug", "Feature", "Task", "Question", "Documentation"],
      allow_custom_values: true,
    },

    comments: {
      type: "string",
      input_type: "rich_text",
      required: false,
      description:
        "Visible comments, discussion snippets, or condensed conversation extracted from the issue thread.",
    },

    repository_visibility: {
      type: "string",
      input_type: "dropdown",
      required: false,
      description:
        "Visibility of the repository, if visible in the analyzed context.",
      allowed_values: ["Public", "Private", "Internal"],
      allow_custom_values: false,
    },
  },
} as const;
