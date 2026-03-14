export const azureDevopsTicketSchema = {
  entity: "azure_devops_work_item",
  version: "2.0",
  description:
    "Schema for Azure DevOps work item analysis with system fields, process-aware metadata, workflow normalization, board context, lifecycle data, relations, discussion, and analysis confidence.",

  metadata: {
    organization: {
      type: "string",
      input_type: "text",
      required: false,
      description:
        "Azure DevOps organization name or tenant context associated with the work item.",
      examples: ["contoso", "fabrikam-dev"],
    },

    project: {
      type: "string",
      input_type: "dropdown",
      required: true,
      description:
        "Azure DevOps project where the work item belongs or will be created.",
      examples: ["My Project", "Platform Team", "Customer Portal"],
      allow_custom_values: true,
    },

    team: {
      type: "string",
      input_type: "text",
      required: false,
      description:
        "Team within the project associated with the work item, if visible or known.",
      examples: ["Frontend", "Payments Team", "Core Platform"],
    },

    process_name: {
      type: "string",
      input_type: "dropdown",
      required: false,
      description:
        "Detected or configured Azure DevOps process name for the project.",
      allowed_values: [
        "Basic",
        "Agile",
        "Scrum",
        "CMMI",
        "Inherited",
        "Custom",
      ],
      allow_custom_values: true,
    },

    process_model: {
      type: "string",
      input_type: "dropdown",
      required: false,
      description:
        "High-level process model classification used for normalization.",
      allowed_values: [
        "Basic",
        "Agile",
        "Scrum",
        "CMMI",
        "Inherited",
        "Custom",
      ],
      allow_custom_values: true,
    },

    work_item_id: {
      type: "string",
      input_type: "text",
      required: false,
      description: "Azure DevOps work item ID.",
      examples: ["12345", "9876"],
    },

    work_item_type: {
      type: "string",
      input_type: "dropdown",
      required: true,
      description: "Type of Azure DevOps work item.",
      allowed_values: [
        "Epic",
        "Feature",
        "User Story",
        "Product Backlog Item",
        "Requirement",
        "Task",
        "Bug",
        "Issue",
        "Change Request",
        "Test Case",
        "Impediment",
      ],
      allow_custom_values: true,
    },

    title: {
      type: "string",
      input_type: "text",
      required: true,
      description: "Short title describing the work item.",
    },

    url: {
      type: "string",
      input_type: "text",
      required: false,
      description: "Direct Azure DevOps URL to the work item, if available.",
    },

    reference_names_discovered: {
      type: "array",
      input_type: "multiselect",
      required: false,
      description:
        "List of Azure DevOps field reference names discovered from metadata or API.",
      items: {
        type: "string",
      },
    },

    work_item_types_discovered: {
      type: "array",
      input_type: "multiselect",
      required: false,
      description:
        "List of work item types discovered as valid for the current project/process.",
      items: {
        type: "string",
      },
    },
  },

  core: {
    description: {
      type: "string",
      input_type: "rich_text",
      required: false,
      reference_name: "System.Description",
      aliases: ["Description", "Details"],
      description:
        "Detailed explanation of the work item, expected behavior, scope, or reproduction context.",
    },

    assigned_to: {
      type: "user",
      input_type: "user_selector",
      required: false,
      reference_name: "System.AssignedTo",
      aliases: ["Assigned To", "Assignee"],
      description: "User currently responsible for the work item.",
    },

    state: {
      type: "string",
      input_type: "dropdown",
      required: false,
      reference_name: "System.State",
      aliases: ["State", "Status"],
      description: "Current workflow state of the work item.",
      allowed_values: [
        "New",
        "To Do",
        "Approved",
        "Committed",
        "Active",
        "In Progress",
        "Resolved",
        "Done",
        "Closed",
        "Removed",
      ],
      allow_custom_values: true,
    },

    reason: {
      type: "string",
      input_type: "dropdown",
      required: false,
      reference_name: "System.Reason",
      aliases: ["Reason"],
      description:
        "Reason associated with the current state or latest transition.",
      allowed_values: [
        "New",
        "Work started",
        "Accepted",
        "Approved",
        "Committed",
        "Fixed",
        "Completed",
        "Duplicate",
        "Obsolete",
        "As Designed",
        "Cannot Reproduce",
        "Cut",
        "Removed from backlog",
      ],
      allow_custom_values: true,
    },

    priority: {
      type: "number",
      input_type: "dropdown",
      required: false,
      reference_name: "Microsoft.VSTS.Common.Priority",
      aliases: ["Priority"],
      description:
        "Relative importance of the work item. Often numeric in Azure DevOps.",
      allowed_values: [1, 2, 3, 4],
      allow_custom_values: true,
    },

    severity: {
      type: "string",
      input_type: "dropdown",
      required: false,
      reference_name: "Microsoft.VSTS.Common.Severity",
      aliases: ["Severity"],
      description: "Severity level, commonly used for bugs.",
      allowed_values: ["1 - Critical", "2 - High", "3 - Medium", "4 - Low"],
      allow_custom_values: true,
    },

    area_path: {
      type: "string",
      input_type: "dropdown",
      required: false,
      reference_name: "System.AreaPath",
      aliases: ["Area", "Area Path"],
      description:
        "Area path used to classify ownership, team, or product domain.",
      allow_custom_values: true,
      examples: ["My Project\\Frontend", "My Project\\Platform"],
    },

    iteration_path: {
      type: "string",
      input_type: "dropdown",
      required: false,
      reference_name: "System.IterationPath",
      aliases: ["Iteration", "Iteration Path", "Sprint"],
      description: "Iteration or sprint path associated with the work item.",
      allow_custom_values: true,
      examples: ["My Project\\Sprint 1", "My Project\\Release 2026\\Sprint 4"],
    },

    tags: {
      type: "array",
      input_type: "tag_selector",
      required: false,
      reference_name: "System.Tags",
      aliases: ["Tags"],
      description: "Tags used to categorize the work item.",
      items: {
        type: "string",
      },
    },

    created_by: {
      type: "user",
      input_type: "user_selector",
      required: false,
      reference_name: "System.CreatedBy",
      auto_populated: true,
      aliases: ["Created By"],
      description: "User who created the work item.",
    },

    changed_by: {
      type: "user",
      input_type: "user_selector",
      required: false,
      reference_name: "System.ChangedBy",
      auto_populated: true,
      aliases: ["Changed By", "Last Modified By"],
      description: "User who last modified the work item.",
    },

    created_date: {
      type: "datetime",
      input_type: "date_picker",
      required: false,
      reference_name: "System.CreatedDate",
      auto_populated: true,
      aliases: ["Created Date", "Created"],
      description: "Date and time when the work item was created.",
    },

    changed_date: {
      type: "datetime",
      input_type: "date_picker",
      required: false,
      reference_name: "System.ChangedDate",
      auto_populated: true,
      aliases: ["Changed Date", "Updated", "Last Updated"],
      description: "Date and time when the work item was last modified.",
    },

    attachments: {
      type: "array",
      input_type: "file_upload",
      required: false,
      description:
        "Files attached to the work item, such as screenshots, logs, or supporting documents.",
      items: {
        type: "file",
      },
    },
  },

  workflow: {
    state_category: {
      type: "string",
      input_type: "dropdown",
      required: false,
      description: "Normalized workflow category for the current state.",
      allowed_values: [
        "Proposed",
        "In Progress",
        "Resolved",
        "Complete",
        "Removed",
      ],
      allow_custom_values: false,
    },

    state_display: {
      type: "string",
      input_type: "text",
      required: false,
      description:
        "Original state label exactly as shown in the UI before normalization.",
    },

    reason_display: {
      type: "string",
      input_type: "text",
      required: false,
      description:
        "Original reason label exactly as shown in the UI before normalization.",
    },

    is_closed_like: {
      type: "boolean",
      input_type: "checkbox",
      required: false,
      description:
        "Whether the work item is effectively in a done/resolved/closed terminal category.",
    },

    is_removed_like: {
      type: "boolean",
      input_type: "checkbox",
      required: false,
      description:
        "Whether the work item appears removed, cut, or excluded from the active workflow.",
    },
  },

  board_fields: {
    board_column: {
      type: "string",
      input_type: "dropdown",
      required: false,
      reference_name: "System.BoardColumn",
      aliases: ["Board Column", "Column"],
      description: "Board column where the work item currently appears.",
      allow_custom_values: true,
    },

    board_column_done: {
      type: "boolean",
      input_type: "checkbox",
      required: false,
      reference_name: "System.BoardColumnDone",
      aliases: ["Board Column Done", "Column Done"],
      description: "Whether the current board column is treated as done.",
    },

    board_lane: {
      type: "string",
      input_type: "dropdown",
      required: false,
      aliases: ["Board Lane", "Lane", "Swimlane"],
      description: "Board lane or swimlane where the work item is positioned.",
      allow_custom_values: true,
    },

    backlog_level: {
      type: "string",
      input_type: "dropdown",
      required: false,
      description:
        "Backlog level where the item appears, such as Epic, Feature, Requirement, or Story level.",
      allow_custom_values: true,
    },

    rank: {
      type: "number",
      input_type: "number",
      required: false,
      description:
        "Relative backlog ordering if visible or inferred from board/list context.",
    },
  },

  lifecycle: {
    activated_by: {
      type: "user",
      input_type: "user_selector",
      required: false,
      auto_populated: true,
      reference_name: "Microsoft.VSTS.Common.ActivatedBy",
      aliases: ["Activated By"],
      description: "User who activated the work item.",
    },

    activated_date: {
      type: "datetime",
      input_type: "date_picker",
      required: false,
      auto_populated: true,
      reference_name: "Microsoft.VSTS.Common.ActivatedDate",
      aliases: ["Activated Date"],
      description: "Date and time when the work item became active.",
    },

    resolved_by: {
      type: "user",
      input_type: "user_selector",
      required: false,
      auto_populated: true,
      reference_name: "Microsoft.VSTS.Common.ResolvedBy",
      aliases: ["Resolved By"],
      description: "User who resolved the work item.",
    },

    resolved_date: {
      type: "datetime",
      input_type: "date_picker",
      required: false,
      auto_populated: true,
      reference_name: "Microsoft.VSTS.Common.ResolvedDate",
      aliases: ["Resolved Date"],
      description: "Date and time when the work item was resolved.",
    },

    closed_by: {
      type: "user",
      input_type: "user_selector",
      required: false,
      auto_populated: true,
      reference_name: "Microsoft.VSTS.Common.ClosedBy",
      aliases: ["Closed By"],
      description: "User who closed the work item.",
    },

    closed_date: {
      type: "datetime",
      input_type: "date_picker",
      required: false,
      auto_populated: true,
      reference_name: "Microsoft.VSTS.Common.ClosedDate",
      aliases: ["Closed Date"],
      description: "Date and time when the work item was closed.",
    },

    last_transition_summary: {
      type: "string",
      input_type: "text",
      required: false,
      description:
        "Human-readable summary of the latest detected transition, if available.",
    },
  },

  relationships: {
    parent: {
      type: "object",
      input_type: "work_item_selector",
      required: false,
      description: "Parent work item above this item in the hierarchy.",
      properties: {
        work_item_id: {
          type: "string",
        },
        title: {
          type: "string",
        },
        relation_type: {
          type: "string",
        },
      },
    },

    children: {
      type: "array",
      input_type: "relationship_selector",
      required: false,
      description: "Child work items under this item in the hierarchy.",
      items: {
        type: "object",
        properties: {
          work_item_id: {
            type: "string",
          },
          title: {
            type: "string",
          },
          relation_type: {
            type: "string",
          },
        },
      },
    },

    work_item_links: {
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
              "Tested By",
              "Tests",
              "Hierarchy Forward",
              "Hierarchy Reverse",
            ],
          },
          relation_reference_name: {
            type: "string",
          },
          topology: {
            type: "string",
            allowed_values: ["tree", "dependency", "network", "resourceLink"],
          },
          work_item_id: {
            type: "string",
          },
          title: {
            type: "string",
          },
          state: {
            type: "string",
          },
        },
      },
    },

    resource_links: {
      type: "array",
      input_type: "relationship_selector",
      required: false,
      description:
        "External or resource-level links such as hyperlinks and attached files.",
      items: {
        type: "object",
        properties: {
          relation_type: {
            type: "string",
            allowed_values: ["Hyperlink", "AttachedFile", "ArtifactLink"],
          },
          name: {
            type: "string",
          },
          url: {
            type: "string",
          },
        },
      },
    },

    external_links: {
      type: "array",
      input_type: "relationship_selector",
      required: false,
      description:
        "External artifacts associated with the work item, such as pull requests, commits, pipelines, or wiki pages.",
      items: {
        type: "object",
        properties: {
          artifact_type: {
            type: "string",
          },
          relation_type: {
            type: "string",
          },
          display_name: {
            type: "string",
          },
          url: {
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
      reference_name: "Microsoft.VSTS.Common.AcceptanceCriteria",
      aliases: ["Acceptance Criteria", "AC"],
      description:
        "Acceptance criteria for the work item. Commonly present on User Stories and similar items.",
    },

    repro_steps: {
      type: "string",
      input_type: "rich_text",
      required: false,
      reference_name: "Microsoft.VSTS.TCM.ReproSteps",
      aliases: ["Repro Steps", "Reproduction Steps", "Steps to Reproduce"],
      description: "Reproduction steps for a bug or issue.",
    },

    story_points: {
      type: "number",
      input_type: "number",
      required: false,
      reference_name: "Microsoft.VSTS.Scheduling.StoryPoints",
      aliases: ["Story Points"],
      description:
        "Relative estimation size of the work item, commonly used in Agile processes.",
    },

    effort: {
      type: "number",
      input_type: "number",
      required: false,
      reference_name: "Microsoft.VSTS.Scheduling.Effort",
      aliases: ["Effort"],
      description:
        "Effort estimate, often used in Scrum processes instead of story points.",
    },

    business_value: {
      type: "number",
      input_type: "number",
      required: false,
      reference_name: "Microsoft.VSTS.Common.BusinessValue",
      aliases: ["Business Value"],
      description: "Business value associated with the work item.",
    },

    risk: {
      type: "number",
      input_type: "dropdown",
      required: false,
      reference_name: "Microsoft.VSTS.Common.Risk",
      aliases: ["Risk"],
      description: "Relative risk associated with the work item.",
      allowed_values: [1, 2, 3, 4],
      allow_custom_values: true,
    },

    original_estimate: {
      type: "number",
      input_type: "number",
      required: false,
      reference_name: "Microsoft.VSTS.Scheduling.OriginalEstimate",
      aliases: ["Original Estimate"],
      description: "Initial estimated work, commonly expressed in hours.",
    },

    remaining_work: {
      type: "number",
      input_type: "number",
      required: false,
      reference_name: "Microsoft.VSTS.Scheduling.RemainingWork",
      aliases: ["Remaining Work"],
      description:
        "Remaining amount of work left to complete, commonly expressed in hours.",
    },

    completed_work: {
      type: "number",
      input_type: "number",
      required: false,
      reference_name: "Microsoft.VSTS.Scheduling.CompletedWork",
      aliases: ["Completed Work"],
      description:
        "Completed amount of work already done, commonly expressed in hours.",
    },

    activity: {
      type: "string",
      input_type: "dropdown",
      required: false,
      reference_name: "Microsoft.VSTS.Common.Activity",
      aliases: ["Activity"],
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
      reference_name: "Microsoft.VSTS.Common.ValueArea",
      aliases: ["Value Area"],
      description:
        "Indicates whether the work primarily delivers business value or architectural value.",
      allowed_values: ["Business", "Architectural"],
      allow_custom_values: true,
    },

    blocked: {
      type: "boolean",
      input_type: "checkbox",
      required: false,
      aliases: ["Blocked"],
      description: "Whether the work item is currently blocked.",
    },

    blocked_reason: {
      type: "string",
      input_type: "text",
      required: false,
      aliases: ["Blocked Reason", "Impediment Reason"],
      description: "Reason why the work item is blocked.",
    },

    target_date: {
      type: "date",
      input_type: "date_picker",
      required: false,
      aliases: ["Target Date"],
      description: "Target completion date for the work item.",
    },

    start_date: {
      type: "date",
      input_type: "date_picker",
      required: false,
      reference_name: "Microsoft.VSTS.Scheduling.StartDate",
      aliases: ["Start Date"],
      description: "Planned start date for the work item.",
    },

    finish_date: {
      type: "date",
      input_type: "date_picker",
      required: false,
      reference_name: "Microsoft.VSTS.Scheduling.FinishDate",
      aliases: ["Finish Date"],
      description: "Planned finish date for the work item.",
    },

    release: {
      type: "string",
      input_type: "text",
      required: false,
      aliases: ["Release", "Milestone", "Version"],
      description:
        "Release, milestone, or version associated with the work item.",
    },

    environment: {
      type: "string",
      input_type: "dropdown",
      required: false,
      aliases: ["Environment"],
      description: "Environment where the issue occurs or applies.",
      allowed_values: ["Development", "QA", "Staging", "Production"],
      allow_custom_values: true,
    },

    found_in_build: {
      type: "string",
      input_type: "text",
      required: false,
      reference_name: "Microsoft.VSTS.Build.FoundIn",
      aliases: ["Found In", "Found In Build"],
      description: "Build or version where the bug or issue was found.",
    },

    integrated_in_build: {
      type: "string",
      input_type: "text",
      required: false,
      aliases: ["Integrated In", "Integrated In Build"],
      description: "Build or version where the fix was integrated.",
    },

    team_project: {
      type: "string",
      input_type: "text",
      required: false,
      reference_name: "System.TeamProject",
      auto_populated: true,
      aliases: ["Team Project"],
      description: "Team project associated with the work item.",
    },

    committed: {
      type: "boolean",
      input_type: "checkbox",
      required: false,
      aliases: ["Committed"],
      description:
        "Whether the work item is marked committed in Scrum-like processes.",
    },

    custom_unknown_fields: {
      type: "array",
      input_type: "key_value_editor",
      required: false,
      description:
        "Custom or organization-specific fields discovered during analysis but not yet modeled explicitly.",
      items: {
        type: "object",
        properties: {
          display_name: {
            type: "string",
          },
          reference_name: {
            type: "string",
          },
          value: {
            type: "unknown",
          },
        },
      },
    },
  },

  discussion: {
    comment_count: {
      type: "number",
      input_type: "number",
      required: false,
      description:
        "Number of comments or discussion entries associated with the work item.",
    },

    latest_comment_preview: {
      type: "string",
      input_type: "textarea",
      required: false,
      description:
        "Short preview of the most recent visible or retrieved comment.",
    },

    history_summary: {
      type: "string",
      input_type: "textarea",
      required: false,
      description:
        "Condensed summary of relevant work item history, discussion, or recent updates.",
    },

    mentions: {
      type: "array",
      input_type: "tag_selector",
      required: false,
      description:
        "User mentions detected in comments, discussion, or history.",
      items: {
        type: "string",
      },
    },

    has_unresolved_questions: {
      type: "boolean",
      input_type: "checkbox",
      required: false,
      description:
        "Whether discussion appears to contain unanswered questions or pending clarification.",
    },

    discussion_visible: {
      type: "boolean",
      input_type: "checkbox",
      required: false,
      description:
        "Whether the discussion/history section was actually visible in the analyzed source.",
    },
  },

  analysis: {
    source: {
      type: "string",
      input_type: "dropdown",
      required: false,
      description: "Primary analysis source used to extract this work item.",
      allowed_values: ["screenshot", "api", "hybrid", "manual"],
      allow_custom_values: false,
    },

    confidence: {
      type: "number",
      input_type: "number",
      required: false,
      description:
        "Overall confidence score for the extracted work item analysis.",
      examples: [0.62, 0.91],
    },

    process_guess: {
      type: "string",
      input_type: "dropdown",
      required: false,
      description:
        "Best-effort guess of the Azure DevOps process based on visible fields and workflow language.",
      allowed_values: [
        "Basic",
        "Agile",
        "Scrum",
        "CMMI",
        "Inherited",
        "Custom",
      ],
      allow_custom_values: true,
    },

    visible_fields: {
      type: "array",
      input_type: "multiselect",
      required: false,
      description: "Fields clearly visible in the analyzed source.",
      items: {
        type: "string",
      },
    },

    inferred_fields: {
      type: "array",
      input_type: "multiselect",
      required: false,
      description: "Fields inferred from context rather than directly visible.",
      items: {
        type: "string",
      },
    },

    missing_but_expected: {
      type: "array",
      input_type: "multiselect",
      required: false,
      description:
        "Important fields expected for the detected work item type/process but not visible.",
      items: {
        type: "string",
      },
    },

    hidden_possible_fields: {
      type: "array",
      input_type: "multiselect",
      required: false,
      description:
        "Fields likely present in Azure DevOps but not visible due to cropping, tabs, or layout.",
      items: {
        type: "string",
      },
    },

    notes: {
      type: "array",
      input_type: "textarea_list",
      required: false,
      description:
        "Human-readable notes about ambiguity, cropping, hidden sections, or likely extraction issues.",
      items: {
        type: "string",
      },
    },

    warnings: {
      type: "array",
      input_type: "textarea_list",
      required: false,
      description:
        "Warnings about low confidence, conflicting values, or unsupported customizations.",
      items: {
        type: "string",
      },
    },

    extraction_regions: {
      type: "array",
      input_type: "key_value_editor",
      required: false,
      description:
        "Optional mapping of extracted values to screen regions or UI zones.",
      items: {
        type: "object",
        properties: {
          field_name: {
            type: "string",
          },
          region: {
            type: "string",
            allowed_values: [
              "header",
              "left_panel",
              "right_panel",
              "details_tab",
              "discussion_tab",
              "relations_tab",
              "board_card",
              "footer",
              "unknown",
            ],
          },
        },
      },
    },
  },

  field_analysis: {
    type: "array",
    input_type: "field_confidence_table",
    required: false,
    description:
      "Per-field extraction evidence and confidence tracking for screenshot or hybrid analysis.",
    items: {
      type: "object",
      properties: {
        field_name: {
          type: "string",
        },
        reference_name: {
          type: "string",
        },
        value: {
          type: "unknown",
        },
        confidence: {
          type: "number",
        },
        evidence: {
          type: "string",
          allowed_values: [
            "visible_label_and_value",
            "visible_value_inferred_label",
            "layout_inference",
            "process_inference",
            "api_field",
            "ocr_guess",
            "manual_override",
          ],
        },
        visibility: {
          type: "string",
          allowed_values: ["visible", "cropped", "inferred", "not_visible"],
        },
        source_region: {
          type: "string",
          allowed_values: [
            "header",
            "left_panel",
            "right_panel",
            "details_tab",
            "discussion_tab",
            "relations_tab",
            "board_card",
            "footer",
            "unknown",
          ],
        },
      },
    },
  },

  process_field_packs: {
    agile: {
      type: "object",
      required: false,
      description:
        "Agile-oriented field pack to help normalize Agile projects.",
      properties: {
        user_story_hint: {
          type: "boolean",
        },
        uses_story_points: {
          type: "boolean",
        },
        uses_acceptance_criteria: {
          type: "boolean",
        },
      },
    },

    scrum: {
      type: "object",
      required: false,
      description:
        "Scrum-oriented field pack to help normalize Scrum projects.",
      properties: {
        product_backlog_item_hint: {
          type: "boolean",
        },
        uses_effort: {
          type: "boolean",
        },
        uses_committed: {
          type: "boolean",
        },
      },
    },

    cmmi: {
      type: "object",
      required: false,
      description: "CMMI-oriented field pack to help normalize CMMI projects.",
      properties: {
        requirement_hint: {
          type: "boolean",
        },
        change_request_hint: {
          type: "boolean",
        },
        uses_risk_and_business_value: {
          type: "boolean",
        },
      },
    },

    basic: {
      type: "object",
      required: false,
      description:
        "Basic-process-oriented field pack to help normalize Basic projects.",
      properties: {
        issue_hint: {
          type: "boolean",
        },
        epic_feature_issue_task_pattern: {
          type: "boolean",
        },
      },
    },
  },
} as const;
