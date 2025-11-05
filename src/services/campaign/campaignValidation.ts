/**
 * Campaign Validation Service
 * Enterprise-grade validation for campaign data
 */

import { Campaign } from '@/types'

export interface ValidationError {
  field: string
  message: string
  code?: string
}

export interface ValidationResult {
  isValid: boolean
  errors: ValidationError[]
  sanitized?: any
}

export class CampaignValidator {
  private static readonly MAX_NAME_LENGTH = 100
  private static readonly MAX_DESCRIPTION_LENGTH = 500
  private static readonly MAX_GOALS = 20
  private static readonly MAX_GOAL_LENGTH = 200
  private static readonly MAX_THEMES = 10
  private static readonly MIN_CAMPAIGN_DURATION_DAYS = 1
  private static readonly MAX_CAMPAIGN_DURATION_DAYS = 365

  /**
   * Validate campaign creation data
   */
  static validateCreate(data: Partial<Campaign>): ValidationResult {
    const errors: ValidationError[] = []

    // Name validation
    if (!data.name || typeof data.name !== 'string') {
      errors.push({
        field: 'name',
        message: 'Campaign name is required',
        code: 'REQUIRED'
      })
    } else {
      const trimmedName = data.name.trim()
      if (trimmedName.length === 0) {
        errors.push({
          field: 'name',
          message: 'Campaign name cannot be empty',
          code: 'EMPTY'
        })
      } else if (trimmedName.length > this.MAX_NAME_LENGTH) {
        errors.push({
          field: 'name',
          message: `Campaign name must be ${this.MAX_NAME_LENGTH} characters or less`,
          code: 'TOO_LONG'
        })
      }
    }

    // Description validation
    if (data.description && data.description.length > this.MAX_DESCRIPTION_LENGTH) {
      errors.push({
        field: 'description',
        message: `Description must be ${this.MAX_DESCRIPTION_LENGTH} characters or less`,
        code: 'TOO_LONG'
      })
    }

    // Date validation
    const dateErrors = this.validateDates(data.startDate, data.endDate)
    errors.push(...dateErrors)

    // Goals validation
    if (data.goals) {
      const goalsErrors = this.validateGoals(data.goals)
      errors.push(...goalsErrors)
    }

    // Content themes validation
    if (data.contentThemes) {
      const themesErrors = this.validateThemes(data.contentThemes)
      errors.push(...themesErrors)
    }

    // Status validation
    if (data.status && !['planning', 'active', 'paused', 'completed'].includes(data.status)) {
      errors.push({
        field: 'status',
        message: 'Invalid campaign status',
        code: 'INVALID_VALUE'
      })
    }

    // Campaign type validation
    if (data.campaignType && !['awareness', 'engagement', 'conversion', 'retention'].includes(data.campaignType)) {
      errors.push({
        field: 'campaignType',
        message: 'Invalid campaign type',
        code: 'INVALID_VALUE'
      })
    }

    // Sanitize data if validation passes
    const sanitized = errors.length === 0 ? this.sanitize(data) : undefined

    return {
      isValid: errors.length === 0,
      errors,
      sanitized
    }
  }

  /**
   * Validate campaign update data
   */
  static validateUpdate(data: Partial<Campaign>): ValidationResult {
    // Similar to create but allows partial updates
    const errors: ValidationError[] = []

    if (data.name !== undefined) {
      if (typeof data.name !== 'string' || data.name.trim().length === 0) {
        errors.push({
          field: 'name',
          message: 'Campaign name cannot be empty',
          code: 'EMPTY'
        })
      } else if (data.name.length > this.MAX_NAME_LENGTH) {
        errors.push({
          field: 'name',
          message: `Campaign name must be ${this.MAX_NAME_LENGTH} characters or less`,
          code: 'TOO_LONG'
        })
      }
    }

    if (data.description !== undefined && data.description.length > this.MAX_DESCRIPTION_LENGTH) {
      errors.push({
        field: 'description',
        message: `Description must be ${this.MAX_DESCRIPTION_LENGTH} characters or less`,
        code: 'TOO_LONG'
      })
    }

    if (data.startDate !== undefined || data.endDate !== undefined) {
      const dateErrors = this.validateDates(data.startDate, data.endDate)
      errors.push(...dateErrors)
    }

    if (data.goals !== undefined) {
      const goalsErrors = this.validateGoals(data.goals)
      errors.push(...goalsErrors)
    }

    if (data.contentThemes !== undefined) {
      const themesErrors = this.validateThemes(data.contentThemes)
      errors.push(...themesErrors)
    }

    const sanitized = errors.length === 0 ? this.sanitize(data) : undefined

    return {
      isValid: errors.length === 0,
      errors,
      sanitized
    }
  }

  /**
   * Validate date range
   */
  private static validateDates(startDate?: string, endDate?: string): ValidationError[] {
    const errors: ValidationError[] = []

    if (startDate) {
      const start = new Date(startDate)
      if (isNaN(start.getTime())) {
        errors.push({
          field: 'startDate',
          message: 'Invalid start date',
          code: 'INVALID_DATE'
        })
        return errors
      }

      if (endDate) {
        const end = new Date(endDate)
        if (isNaN(end.getTime())) {
          errors.push({
            field: 'endDate',
            message: 'Invalid end date',
            code: 'INVALID_DATE'
          })
          return errors
        }

        if (end <= start) {
          errors.push({
            field: 'endDate',
            message: 'End date must be after start date',
            code: 'INVALID_RANGE'
          })
        }

        const durationDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
        
        if (durationDays < this.MIN_CAMPAIGN_DURATION_DAYS) {
          errors.push({
            field: 'dateRange',
            message: `Campaign must be at least ${this.MIN_CAMPAIGN_DURATION_DAYS} day(s) long`,
            code: 'TOO_SHORT'
          })
        }

        if (durationDays > this.MAX_CAMPAIGN_DURATION_DAYS) {
          errors.push({
            field: 'dateRange',
            message: `Campaign cannot be longer than ${this.MAX_CAMPAIGN_DURATION_DAYS} days`,
            code: 'TOO_LONG'
          })
        }
      }
    }

    return errors
  }

  /**
   * Validate goals array
   */
  private static validateGoals(goals: string[]): ValidationError[] {
    const errors: ValidationError[] = []

    if (!Array.isArray(goals)) {
      errors.push({
        field: 'goals',
        message: 'Goals must be an array',
        code: 'INVALID_TYPE'
      })
      return errors
    }

    if (goals.length > this.MAX_GOALS) {
      errors.push({
        field: 'goals',
        message: `Maximum ${this.MAX_GOALS} goals allowed`,
        code: 'TOO_MANY'
      })
    }

    goals.forEach((goal, index) => {
      if (typeof goal !== 'string') {
        errors.push({
          field: `goals[${index}]`,
          message: 'Goal must be a string',
          code: 'INVALID_TYPE'
        })
      } else if (goal.trim().length === 0) {
        errors.push({
          field: `goals[${index}]`,
          message: 'Goal cannot be empty',
          code: 'EMPTY'
        })
      } else if (goal.length > this.MAX_GOAL_LENGTH) {
        errors.push({
          field: `goals[${index}]`,
          message: `Goal must be ${this.MAX_GOAL_LENGTH} characters or less`,
          code: 'TOO_LONG'
        })
      }
    })

    return errors
  }

  /**
   * Validate content themes
   */
  private static validateThemes(themes: string[]): ValidationError[] {
    const errors: ValidationError[] = []

    if (!Array.isArray(themes)) {
      errors.push({
        field: 'contentThemes',
        message: 'Content themes must be an array',
        code: 'INVALID_TYPE'
      })
      return errors
    }

    if (themes.length > this.MAX_THEMES) {
      errors.push({
        field: 'contentThemes',
        message: `Maximum ${this.MAX_THEMES} themes allowed`,
        code: 'TOO_MANY'
      })
    }

    themes.forEach((theme, index) => {
      if (typeof theme !== 'string' || theme.trim().length === 0) {
        errors.push({
          field: `contentThemes[${index}]`,
          message: 'Theme cannot be empty',
          code: 'EMPTY'
        })
      }
    })

    return errors
  }

  /**
   * Sanitize campaign data
   */
  private static sanitize(data: Partial<Campaign>): Partial<Campaign> {
    const sanitized: any = { ...data }

    // Trim strings
    if (sanitized.name) {
      sanitized.name = this.sanitizeString(sanitized.name)
    }
    if (sanitized.description) {
      sanitized.description = this.sanitizeString(sanitized.description)
    }

    // Sanitize arrays
    if (sanitized.goals) {
      sanitized.goals = sanitized.goals
        .map((g: string) => this.sanitizeString(g))
        .filter((g: string) => g.length > 0)
    }

    if (sanitized.contentThemes) {
      sanitized.contentThemes = sanitized.contentThemes
        .map((t: string) => this.sanitizeString(t))
        .filter((t: string) => t.length > 0)
    }

    return sanitized
  }

  /**
   * Sanitize string input (basic XSS prevention)
   */
  private static sanitizeString(str: string): string {
    return str
      .trim()
      .replace(/[<>]/g, '') // Remove potential HTML tags
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/on\w+=/gi, '') // Remove event handlers
  }

  /**
   * Validate campaign name uniqueness (async)
   */
  static async validateNameUnique(
    name: string,
    workspaceId: string,
    excludeCampaignId?: string
  ): Promise<ValidationResult> {
    // This would check against database
    // Implementation depends on your data access layer
    return {
      isValid: true,
      errors: []
    }
  }
}
