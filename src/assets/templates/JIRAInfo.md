# Jira Ticket Fields Documentation

This document describes the fields available when creating a **Jira Task** using the **Create Tarefa** form.

Each field includes:

- Field name
- Required status
- Input type
- Available options (when applicable)
- Description

---

# Jira Ticket Fields

## Space

| Property | Value |
|--------|------|
| Field name | Space |
| Required | Yes |
| Input type | Dropdown |
| Example options | `personal (PER)`, `Demo service space (DEMO)` |
| Description | Defines the **project space** where the issue will be created. The selected space determines the **workflow, permissions, components, teams, and configuration** used by the ticket. |

---

## Work type

| Property | Value |
|--------|------|
| Field name | Work type |
| Required | Yes |
| Input type | Dropdown |
| Options | `Tarefa`, `[System] Service request`, `[System] Incident`, `[System] Service request with approvals` |
| Description | Defines the **type of work item** being created. Each type can trigger **different workflows, automation rules, approval requirements, and lifecycle states**. |

---

## Request type

| Property | Value |
|--------|------|
| Field name | Request type |
| Required | Yes |
| Input type | Dropdown |
| Options | `No request type` |
| Description | Defines how the ticket behaves within the **Service Desk portal**. If **No request type** is selected, the issue is treated as an **internal ticket** and cannot be shared with customers. |

---

## Titulo (Title)

| Property | Value |
|--------|------|
| Field name | Titulo (Title) |
| Required | Yes |
| Input type | Text field |
| Description | A **short title describing the task or issue**. This field should clearly summarize the problem or objective so it can be easily identified in boards, backlogs, and reports. |

---

## Componentes (Components)

| Property | Value |
|--------|------|
| Field name | Componentes |
| Required | No |
| Input type | Dropdown |
| Example options | `Active Directory`, `Analytics and Reporting Service`, `Billing Services`, `Cloud Storage Services`, `Data Center Services`, `Email and Collaboration Services`, `Financial Services`, `HR Services`, `Intranet` |
| Description | Specifies the **system component, module, or service area** associated with the issue. Components help categorize issues and assign responsibility to specific technical areas. |

---

## Anexos (Attachments)

| Property | Value |
|--------|------|
| Field name | Anexos |
| Required | No |
| Input type | File upload |
| Description | Allows users to attach **supporting files** such as screenshots, logs, documentation, or design assets that help explain or reproduce the issue. |

---

## Data limite (Due Date)

| Property | Value |
|--------|------|
| Field name | Data limite |
| Required | No |
| Input type | Date picker |
| Description | Defines the **deadline by which the task should be completed**. Used for scheduling and tracking overdue issues. |

---

## Descrição (Description)

| Property | Value |
|--------|------|
| Field name | Descrição |
| Required | No |
| Input type | Rich text editor |
| Description | Provides a **detailed explanation of the issue or task**. This may include steps to reproduce, expected behavior, acceptance criteria, or technical notes. |

---

## Criador (Creator)

| Property | Value |
|--------|------|
| Field name | Criador |
| Required | No (auto-populated) |
| Input type | User selector |
| Description | Identifies the **user who created the ticket**. This field is automatically filled by the system. |

---

## Linked Work items

| Property | Value |
|--------|------|
| Field name | Linked Work items |
| Required | No |
| Input type | Dropdown + Issue selector |
| Relationship options | `blocks`, `is blocked by`, `clones`, `is cloned by`, `duplicates`, `is duplicated by`, `causes`, `is caused by`, `relates to` |
| Description | Defines a **relationship between the current issue and other issues**. This helps represent dependencies, duplications, or logical connections between tasks. |

---

## Responsável (Assignee)

| Property | Value |
|--------|------|
| Field name | Responsável |
| Required | No |
| Input type | User selector |
| Default value | `Automático` |
| Description | Specifies the **person responsible for resolving the issue**. If automatic assignment is enabled, Jira may assign the issue based on project rules. |

---

## Prioridade (Priority)

| Property | Value |
|--------|------|
| Field name | Prioridade |
| Required | No |
| Input type | Dropdown |
| Options | `Highest`, `High`, `Medium`, `Low`, `Lowest` |
| Description | Defines the **relative importance of the issue compared to other tasks**. Priority helps teams determine which work should be addressed first. |

---

## Team

| Property | Value |
|--------|------|
| Field name | Team |
| Required | No |
| Input type | Dropdown |
| Description | Associates the issue with a **specific team responsible for the work**. This allows filtering, reporting, and team-based ownership of issues. |

---

## Etiquetas (Labels)

| Property | Value |
|--------|------|
| Field name | Etiquetas |
| Required | No |
| Input type | Tag selector |
| Example | `demo-desk` |
| Description | Labels are **custom tags used to categorize issues** across projects. They help with filtering, grouping, and organizing work items. |

---

## Affected services

| Property | Value |
|--------|------|
| Field name | Affected services |
| Required | No |
| Input type | Dropdown |
| Description | Links the issue to a **service registered in the service catalog**. This helps track which services are impacted by incidents or requests. |

---

## Urgency

| Property | Value |
|--------|------|
| Field name | Urgency |
| Required | No |
| Input type | Dropdown |
| Options | `Critical`, `High`, `Medium`, `Low` |
| Description | Indicates **how quickly the issue needs to be addressed**. Urgency reflects the **time sensitivity** of the problem. |

---

## Impact

| Property | Value |
|--------|------|
| Field name | Impact |
| Required | No |
| Input type | Dropdown |
| Options | `Extensive / Widespread`, `Significant / Large`, `Moderate / Limited`, `Minor / Localized` |
| Description | Defines the **scale of the issue** in terms of affected users, systems, or services. Impact represents the **breadth of the problem**. |

---

## Pending reason

| Property | Value |
|--------|------|
| Field name | Pending reason |
| Required | No |
| Input type | Dropdown |
| Options | `More info required`, `Awaiting approval`, `Waiting on vendor`, `Pending on change request` |
| Description | Specifies the **reason why an issue is currently in a pending state**. Helps explain delays or external dependencies. |

---

## Approver groups

| Property | Value |
|--------|------|
| Field name | Approver groups |
| Required | No |
| Input type | Text / Group selector |
| Description | Contains **groups of users that must approve the request** before the task can proceed. Often used in service management workflows. |

---

## Request language

| Property | Value |
|--------|------|
| Field name | Request language |
| Required | No |
| Input type | Text |
| Description | Indicates the **language in which the request was originally created**. Useful for multilingual support environments. |

---

## Original Estimate

| Property | Value |
|--------|------|
| Field name | Original Estimate |
| Required | No |
| Input type | Text |
| Format example | `2w 1d 5h 4m` |
| Description | Represents the **estimated amount of work required to complete the issue**. Time can be expressed in weeks, days, hours, and minutes. |

---

## Approvers

| Property | Value |
|--------|------|
| Field name | Approvers |
| Required | No |
| Input type | User selector |
| Description | Specifies **individual users who must approve the request** before it moves forward in the workflow. |

---

## Organizations

| Property | Value |
|--------|------|
| Field name | Organizations |
| Required | No |
| Input type | Dropdown |
| Description | Associates the request with a **customer organization** in Jira Service Management. Used when requests come from external clients or departments. |

---

# Notes

- Fields marked with `*` in Jira are **required for ticket creation**.
- Some fields appear only in **Service Management projects**.
- Available options may vary depending on **project configuration and permissions**.