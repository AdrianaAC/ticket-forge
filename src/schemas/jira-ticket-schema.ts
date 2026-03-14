export const jiraTicketSchema = {
  entity: "jira_issue",
  description:
    "Schema for a Jira issue/work item with core Jira fields plus instance-specific custom fields.",

  core: {
    project: {
      type: "string",
      input_type: "dropdown",
      required: true,
      description:
        "Project or space where the issue will be created.",
      allowed_values: ["personal (PER)", "Demo service space (DEMO)"],
      examples: ["personal (PER)", "Demo service space (DEMO)"],
      allow_custom_values: true,
    },

    issue_type: {
      type: "string",
      input_type: "dropdown",
      required: true,
      description:
        "Type of Jira work item.",
      allowed_values: ["Epic", "Task", "Story", "Bug", "Sub-task"],
      allow_custom_values: true,
    },

    title: {
      type: "string",
      input_type: "text",
      required: true,
      description:
        "Short title describing the issue or task.",
    },

    description: {
      type: "string",
      input_type: "rich_text",
      required: false,
      description:
        "Detailed explanation of the issue, task, reproduction steps, or acceptance criteria.",
    },

    assignee: {
      type: "user",
      input_type: "user_selector",
      required: false,
      description:
        "User responsible for the issue.",
    },

    status: {
      type: "string",
      input_type: "dropdown",
      required: false,
      description:
        "Current workflow status of the issue.",
      allowed_values: [
        "To Do",
        "In Progress",
        "In Review",
        "Blocked",
        "Done",
        "Cancelled",
      ],
      allow_custom_values: false,
    },

    priority: {
      type: "string",
      input_type: "dropdown",
      required: false,
      description:
        "Relative importance of the issue.",
      allowed_values: ["Highest", "High", "Medium", "Low", "Lowest"],
      allow_custom_values: false,
    },

    due_date: {
      type: "date",
      input_type: "date_picker",
      required: false,
      description:
        "Deadline for completing the issue.",
    },

    attachments: {
      type: "array",
      input_type: "file_upload",
      required: false,
      items: {
        type: "file",
      },
      description:
        "Files attached to the issue, such as screenshots, logs, or documents.",
    },
  },

  relationships: {
    parent: {
      type: "string",
      input_type: "issue_selector",
      required: false,
      description:
        "Parent issue above this one in the hierarchy.",
    },

    linked_issues: {
      type: "array",
      input_type: "relationship_selector",
      required: false,
      description:
        "Links between this issue and other Jira issues.",
      items: {
        type: "object",
        properties: {
          relation_type: {
            type: "string",
            allowed_values: [
              "blocks",
              "is blocked by",
              "clones",
              "is cloned by",
              "duplicates",
              "is duplicated by",
              "relates to",
            ],
          },
          issue_key: {
            type: "string",
          },
        },
      },
    },
  },

  custom_fields: {
    request_type: {
      type: "string",
      input_type: "dropdown",
      required: false,
      description:
        "Project-specific or service-desk-specific request classification.",
      allowed_values: ["No request type"],
      allow_custom_values: true,
    },

    components: {
      type: "array",
      input_type: "dropdown",
      required: false,
      allowed_values: [
        "Active Directory",
        "Analytics and Reporting Service",
        "Billing Services",
        "Cloud Storage Services",
        "Data Center Services",
        "Email and Collaboration Services",
        "Financial Services",
        "HR Services",
        "Intranet",
      ],
      items: {
        type: "string",
      },
      description:
        "Project components or service areas associated with the issue.",
      allow_custom_values: true,
    },

    team: {
      type: "string",
      input_type: "dropdown",
      required: false,
      description:
        "Team associated with the issue.",
      allow_custom_values: true,
    },

    labels: {
      type: "array",
      input_type: "tag_selector",
      required: false,
      items: {
        type: "string",
      },
      description:
        "Custom labels or tags used to categorize the issue.",
    },

    affected_services: {
      type: "array",
      input_type: "dropdown",
      required: false,
      items: {
        type: "string",
      },
      description:
        "Services impacted by the issue.",
      allow_custom_values: true,
    },

    urgency: {
      type: "string",
      input_type: "dropdown",
      required: false,
      description:
        "How quickly the issue needs attention.",
      allowed_values: ["Critical", "High", "Medium", "Low"],
      allow_custom_values: false,
    },

    impact: {
      type: "string",
      input_type: "dropdown",
      required: false,
      description:
        "Scale or breadth of impact caused by the issue.",
      allowed_values: [
        "Extensive / Widespread",
        "Significant / Large",
        "Moderate / Limited",
        "Minor / Localized",
      ],
      allow_custom_values: false,
    },

    pending_reason: {
      type: "string",
      input_type: "dropdown",
      required: false,
      description:
        "Reason the issue is currently pending.",
      allowed_values: [
        "More info required",
        "Awaiting approval",
        "Waiting on vendor",
        "Pending on change request",
      ],
      allow_custom_values: false,
    },

    approver_groups: {
      type: "array",
      input_type: "group_selector",
      required: false,
      items: {
        type: "string",
      },
      description:
        "Groups required to approve the request.",
    },

    approvers: {
      type: "array",
      input_type: "user_selector",
      required: false,
      items: {
        type: "user",
      },
      description:
        "Individual users required to approve the request.",
    },

    organizations: {
      type: "array",
      input_type: "dropdown",
      required: false,
      items: {
        type: "string",
      },
      description:
        "Organizations associated with the request.",
      allow_custom_values: true,
    },

    request_language: {
      type: "string",
      input_type: "text",
      required: false,
      description:
        "Language in which the request was raised.",
    },

    original_estimate: {
      type: "string",
      input_type: "text",
      required: false,
      pattern: "([0-9]+w)? ?([0-9]+d)? ?([0-9]+h)? ?([0-9]+m)?",
      example: "2w 1d 5h 4m",
      description:
        "Estimated amount of work required to complete the issue.",
    },

    creator: {
      type: "user",
      input_type: "user_selector",
      required: false,
      auto_populated: true,
      description:
        "User who created the issue.",
    },
  },
} as const;
