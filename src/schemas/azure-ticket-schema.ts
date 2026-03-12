export const azureDevopsTicketSchema = {
  entity: "azure_devops_work_item",
  description:
    "Schema for an Azure DevOps work item with core system fields plus process-specific custom fields.",

  core: {
    project: {
      type: "string",
      input_type: "dropdown",
      required: true,
      description:
        "Azure DevOps project where the work item will be created.",
      examples: ["My Project", "Platform Team", "Customer Portal"],
      allow_custom_values: true,
    },

    work_item_type: {
      type: "string",
      input_type: "dropdown",
      required: true,
      description:
        "Type of Azure DevOps work item.",
      allowed_values: [
        "Epic",
        "Feature",
        "User Story",
        "Task",
        "Bug",
        "Issue",
        "Requirement",
      ],
      allow_custom_values: true,
    },

    title: {
      type: "string",
      input_type: "text",
      required: true,
      description:
        "Short title describing the work item.",
    },

    description: {
      type: "string",
      input_type: "rich_text",
      required: false,
      description:
        "Detailed explanation of the work item, expected behavior, acceptance criteria, or reproduction steps.",
    },

    assigned_to: {
      type: "user",
      input_type: "user_selector",
      required: false,
      description:
        "User responsible for the work item.",
    },

    state: {
      type: "string",
      input_type: "dropdown",
      required: false,
      description:
        "Current workflow state of the work item.",
      allowed_values: [
        "New",
        "Active",
        "Resolved",
        "Closed",
        "Removed",
      ],
      allow_custom_values: true,
    },

    reason: {
      type: "string",
      input_type: "dropdown",
      required: false,
      description:
        "Reason associated with the current state transition.",
      allowed_values: [
        "New",
        "Work started",
        "Accepted",
        "Fixed",
        "Duplicate",
        "Obsolete",
        "As Designed",
        "Cannot Reproduce",
        "Cut",
      ],
      allow_custom_values: true,
    },

    priority: {
      type: "number",
      input_type: "dropdown",
      required: false,
      description:
        "Relative importance of the work item. In Azure DevOps this is often numeric.",
      allowed_values: [1, 2, 3, 4],
      allow_custom_values: true,
    },

    severity: {
      type: "string",
      input_type: "dropdown",
      required: false,
      description:
        "Severity level, commonly used for bugs.",
      allowed_values: ["1 - Critical", "2 - High", "3 - Medium", "4 - Low"],
      allow_custom_values: true,
    },

    area_path: {
      type: "string",
      input_type: "dropdown",
      required: false,
      description:
        "Area path used to classify ownership, product area, or team.",
      allow_custom_values: true,
      examples: ["My Project\\Frontend", "My Project\\Platform"],
    },

    iteration_path: {
      type: "string",
      input_type: "dropdown",
      required: false,
      description:
        "Iteration or sprint path associated with the work item.",
      allow_custom_values: true,
      examples: ["My Project\\Sprint 1", "My Project\\Release 2026\\Sprint 4"],
    },

    tags: {
      type: "array",
      input_type: "tag_selector",
      required: false,
      items: {
        type: "string",
      },
      description:
        "Tags used to categorize the work item.",
    },

    created_by: {
      type: "user",
      input_type: "user_selector",
      required: false,
      auto_populated: true,
      description:
        "User who created the work item.",
    },

    changed_by: {
      type: "user",
      input_type: "user_selector",
      required: false,
      auto_populated: true,
      description:
        "User who last modified the work item.",
    },

    created_date: {
      type: "datetime",
      input_type: "date_picker",
      required: false,
      auto_populated: true,
      description:
        "Date and time when the work item was created.",
    },

    changed_date: {
      type: "datetime",
      input_type: "date_picker",
      required: false,
      auto_populated: true,
      description:
        "Date and time when the work item was last changed.",
    },

    attachments: {
      type: "array",
      input_type: "file_upload",
      required: false,
      items: {
        type: "file",
      },
      description:
        "Files attached to the work item, such as screenshots, logs, or supporting documents.",
    },
  },

  relationships: {
    parent: {
      type: "string",
      input_type: "work_item_selector",
      required: false,
      description:
        "Parent work item above this item in the hierarchy.",
    },

    children: {
      type: "array",
      input_type: "relationship_selector",
      required: false,
      description:
        "Child work items under this item in the hierarchy.",
      items: {
        type: "object",
        properties: {
          work_item_id: {
            type: "string",
          },
          title: {
            type: "string",
          },
        },
      },
    },

    linked_items: {
      type: "array",
      input_type: "relationship_selector",
      required: false,
      description:
        "Links between this work item and other Azure DevOps work items.",
      items: {
        type: "object",
        properties: {
          relation_type: {
            type: "string",
            allowed_values: [
              "Parent",
              "Child",
              "Related",
              "Duplicate",
              "Duplicate Of",
              "Successor",
              "Predecessor",
              "Affects",
              "Affected By",
            ],
          },
          work_item_id: {
            type: "string",
          },
        },
      },
    },
  },

  custom_fields: {
    acceptance_criteria: {
      type: "string",
      input_type: "rich_text",
      required: false,
      description:
        "Acceptance criteria for the work item. Commonly present on User Stories and similar items.",
    },

    repro_steps: {
      type: "string",
      input_type: "rich_text",
      required: false,
      description:
        "Reproduction steps for a bug or issue.",
    },

    story_points: {
      type: "number",
      input_type: "number",
      required: false,
      description:
        "Relative estimation size of the work item, commonly used in Agile processes.",
    },

    effort: {
      type: "number",
      input_type: "number",
      required: false,
      description:
        "Effort estimate, often used in Scrum processes instead of story points.",
    },

    business_value: {
      type: "number",
      input_type: "number",
      required: false,
      description:
        "Business value associated with the work item.",
    },

    risk: {
      type: "number",
      input_type: "dropdown",
      required: false,
      description:
        "Relative risk associated with the work item.",
      allowed_values: [1, 2, 3, 4],
      allow_custom_values: true,
    },

    original_estimate: {
      type: "number",
      input_type: "number",
      required: false,
      description:
        "Initial estimated work, commonly expressed in hours.",
    },

    remaining_work: {
      type: "number",
      input_type: "number",
      required: false,
      description:
        "Remaining amount of work left to complete, commonly expressed in hours.",
    },

    completed_work: {
      type: "number",
      input_type: "number",
      required: false,
      description:
        "Completed amount of work already done, commonly expressed in hours.",
    },

    activity: {
      type: "string",
      input_type: "dropdown",
      required: false,
      description:
        "Type of engineering activity associated with the work item.",
      allowed_values: [
        "Development",
        "Testing",
        "Design",
        "Requirements",
        "Documentation",
        "Deployment",
      ],
      allow_custom_values: true,
    },

    value_area: {
      type: "string",
      input_type: "dropdown",
      required: false,
      description:
        "Indicates whether the work primarily delivers business value or architectural value.",
      allowed_values: ["Business", "Architectural"],
      allow_custom_values: true,
    },

    blocked: {
      type: "boolean",
      input_type: "checkbox",
      required: false,
      description:
        "Whether the work item is currently blocked.",
    },

    blocked_reason: {
      type: "string",
      input_type: "text",
      required: false,
      description:
        "Reason why the work item is blocked.",
    },

    target_date: {
      type: "date",
      input_type: "date_picker",
      required: false,
      description:
        "Target completion date for the work item.",
    },

    start_date: {
      type: "date",
      input_type: "date_picker",
      required: false,
      description:
        "Planned start date for the work item.",
    },

    finish_date: {
      type: "date",
      input_type: "date_picker",
      required: false,
      description:
        "Planned finish date for the work item.",
    },

    release: {
      type: "string",
      input_type: "text",
      required: false,
      description:
        "Release, milestone, or version associated with the work item.",
    },

    environment: {
      type: "string",
      input_type: "dropdown",
      required: false,
      description:
        "Environment where the issue occurs or applies.",
      allowed_values: ["Development", "QA", "Staging", "Production"],
      allow_custom_values: true,
    },

    found_in_build: {
      type: "string",
      input_type: "text",
      required: false,
      description:
        "Build or version where the bug or issue was found.",
    },

    integrated_in_build: {
      type: "string",
      input_type: "text",
      required: false,
      description:
        "Build or version where the fix was integrated.",
    },

    team_project: {
      type: "string",
      input_type: "text",
      required: false,
      auto_populated: true,
      description:
        "Team project associated with the work item.",
    },
  },
} as const;