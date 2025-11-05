/**
 * Campaign Export Service
 * Handles exporting campaign data to various formats
 */

import type { Campaign, Post } from '@/types'
import type { CampaignAnalytics } from './campaignAnalytics'

export class CampaignExportService {
  /**
   * Export campaign to CSV
   */
  static exportToCsv(campaign: Campaign, posts: Post[]): void {
    const headers = [
      'Post ID',
      'Topic',
      'Status',
      'Platforms',
      'Scheduled At',
      'Published At',
      'Reach',
      'Engagement',
      'Clicks'
    ]

    const rows = posts.map(post => [
      post.id,
      this.escapeCsv(post.topic),
      post.status,
      post.platforms.join('|'),
      post.scheduledAt || '',
      post.publishedAt || '',
      post.analytics?.reach || 0,
      post.analytics?.engagement || 0,
      post.analytics?.clicks || 0
    ])

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n')

    this.downloadFile(
      csvContent,
      `${this.sanitizeFilename(campaign.name)}_posts.csv`,
      'text/csv;charset=utf-8;'
    )
  }

  /**
   * Export campaign analytics to CSV
   */
  static exportAnalyticsToCsv(campaign: Campaign, analytics: CampaignAnalytics): void {
    const headers = ['Metric', 'Value']
    
    const rows = [
      ['Campaign Name', campaign.name],
      ['Status', campaign.status || 'planning'],
      ['Start Date', new Date(campaign.startDate).toLocaleDateString()],
      ['End Date', campaign.endDate ? new Date(campaign.endDate).toLocaleDateString() : 'Ongoing'],
      ['Total Posts', analytics.performance.totalPosts],
      ['Published Posts', analytics.performance.publishedPosts],
      ['Scheduled Posts', analytics.performance.scheduledPosts],
      ['Draft Posts', analytics.performance.draftPosts],
      ['Total Reach', analytics.performance.totalReach],
      ['Total Engagement', analytics.performance.totalEngagement],
      ['Avg Engagement Rate', `${analytics.performance.avgEngagementRate}%`],
      ['Click Through Rate', `${analytics.performance.clickThroughRate}%`],
      ['Health Score', analytics.healthScore]
    ]

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => this.escapeCsv(String(cell))).join(','))
    ].join('\n')

    this.downloadFile(
      csvContent,
      `${this.sanitizeFilename(campaign.name)}_analytics.csv`,
      'text/csv;charset=utf-8;'
    )
  }

  /**
   * Export campaign to JSON
   */
  static exportToJson(campaign: Campaign, posts: Post[], analytics?: CampaignAnalytics): void {
    const exportData = {
      campaign,
      posts,
      analytics,
      exportedAt: new Date().toISOString()
    }

    const jsonContent = JSON.stringify(exportData, null, 2)

    this.downloadFile(
      jsonContent,
      `${this.sanitizeFilename(campaign.name)}_full_export.json`,
      'application/json;charset=utf-8;'
    )
  }

  /**
   * Export campaign report to HTML (for PDF printing)
   */
  static exportToHtmlReport(campaign: Campaign, analytics: CampaignAnalytics): void {
    const html = this.generateHtmlReport(campaign, analytics)
    
    const blob = new Blob([html], { type: 'text/html;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    
    // Open in new window for printing
    const printWindow = window.open(url, '_blank')
    
    if (!printWindow) {
      alert('Please allow popups to export PDF. Alternatively, use the CSV export.')
      return
    }

    // Auto-trigger print dialog after content loads
    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.print()
      }, 500)
    }
  }

  /**
   * Generate HTML report template
   */
  private static generateHtmlReport(campaign: Campaign, analytics: CampaignAnalytics): string {
    const platformRows = analytics.platforms
      .map(p => `
        <tr>
          <td>${p.platform}</td>
          <td>${p.postsCount}</td>
          <td>${p.avgEngagement.toLocaleString()}</td>
          <td>${p.totalReach.toLocaleString()}</td>
        </tr>
      `)
      .join('')

    const insightRows = analytics.insights
      .map(insight => `
        <div class="insight insight-${insight.type}">
          <h4>${insight.title}</h4>
          <p>${insight.description}</p>
          ${insight.action ? `<span class="action">→ ${insight.action}</span>` : ''}
        </div>
      `)
      .join('')

    const goalRows = analytics.goals
      .map(goal => `
        <div class="goal">
          <div class="goal-header">
            <strong>${this.escapeHtml(goal.goal)}</strong>
            <span class="status-badge status-${goal.status}">${goal.status}</span>
          </div>
          <div class="progress-bar">
            <div class="progress-fill" style="width: ${goal.percentage}%"></div>
          </div>
          <div class="goal-stats">${goal.actual} / ${goal.target || '?'} (${goal.percentage}%)</div>
        </div>
      `)
      .join('')

    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Campaign Report - ${this.escapeHtml(campaign.name)}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
      color: #1f2937;
      padding: 40px;
      background: #ffffff;
      line-height: 1.6;
    }
    .header {
      border-bottom: 3px solid ${campaign.color || '#3B82F6'};
      padding-bottom: 24px;
      margin-bottom: 32px;
    }
    h1 {
      font-size: 32px;
      font-weight: 700;
      margin-bottom: 8px;
      color: #111827;
    }
    .meta {
      color: #6b7280;
      font-size: 14px;
    }
    .badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 12px;
      background: ${campaign.color || '#3B82F6'};
      color: white;
      font-size: 12px;
      font-weight: 600;
      margin-right: 8px;
    }
    .section {
      margin-bottom: 40px;
    }
    h2 {
      font-size: 20px;
      font-weight: 600;
      margin-bottom: 16px;
      color: #111827;
      border-bottom: 2px solid #e5e7eb;
      padding-bottom: 8px;
    }
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 16px;
      margin-bottom: 24px;
    }
    .stat-card {
      background: #f9fafb;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      padding: 16px;
      text-align: center;
    }
    .stat-value {
      font-size: 28px;
      font-weight: 700;
      color: ${campaign.color || '#3B82F6'};
    }
    .stat-label {
      font-size: 12px;
      color: #6b7280;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-top: 4px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 24px;
    }
    th, td {
      text-align: left;
      padding: 12px;
      border-bottom: 1px solid #e5e7eb;
    }
    th {
      background: #f9fafb;
      font-weight: 600;
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: #6b7280;
    }
    .insight {
      background: #f9fafb;
      border-left: 4px solid #3B82F6;
      padding: 16px;
      margin-bottom: 12px;
      border-radius: 4px;
    }
    .insight-warning { border-left-color: #f59e0b; }
    .insight-success { border-left-color: #10b981; }
    .insight-tip { border-left-color: #8b5cf6; }
    .insight h4 {
      font-size: 14px;
      font-weight: 600;
      margin-bottom: 4px;
    }
    .insight p {
      font-size: 13px;
      color: #6b7280;
      margin-bottom: 8px;
    }
    .action {
      font-size: 12px;
      color: #3B82F6;
      font-weight: 600;
    }
    .goal {
      margin-bottom: 16px;
    }
    .goal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
    }
    .status-badge {
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
    }
    .status-on-track { background: #d1fae5; color: #065f46; }
    .status-achieved { background: #a7f3d0; color: #064e3b; }
    .status-at-risk { background: #fed7aa; color: #92400e; }
    .status-failed { background: #fecaca; color: #991b1b; }
    .progress-bar {
      width: 100%;
      height: 8px;
      background: #e5e7eb;
      border-radius: 4px;
      overflow: hidden;
      margin-bottom: 4px;
    }
    .progress-fill {
      height: 100%;
      background: ${campaign.color || '#3B82F6'};
      transition: width 0.3s;
    }
    .goal-stats {
      font-size: 12px;
      color: #6b7280;
    }
    .footer {
      margin-top: 48px;
      padding-top: 24px;
      border-top: 2px solid #e5e7eb;
      text-align: center;
      font-size: 12px;
      color: #9ca3af;
    }
    @media print {
      body { padding: 20px; }
      .stats-grid { grid-template-columns: repeat(2, 1fr); }
      .insight { page-break-inside: avoid; }
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>${this.escapeHtml(campaign.name)}</h1>
    <div class="meta">
      <span class="badge">${campaign.status || 'planning'}</span>
      ${campaign.campaignType ? `<span class="badge">${campaign.campaignType}</span>` : ''}
      <br>
      ${new Date(campaign.startDate).toLocaleDateString()} - ${campaign.endDate ? new Date(campaign.endDate).toLocaleDateString() : 'Ongoing'}
    </div>
    ${campaign.description ? `<p style="margin-top: 12px; color: #6b7280;">${this.escapeHtml(campaign.description)}</p>` : ''}
  </div>

  <div class="section">
    <h2>Performance Overview</h2>
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-value">${analytics.performance.totalPosts}</div>
        <div class="stat-label">Total Posts</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">${analytics.performance.totalReach.toLocaleString()}</div>
        <div class="stat-label">Total Reach</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">${analytics.performance.totalEngagement.toLocaleString()}</div>
        <div class="stat-label">Total Engagement</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">${analytics.healthScore}</div>
        <div class="stat-label">Health Score</div>
      </div>
    </div>
  </div>

  ${analytics.goals.length > 0 ? `
  <div class="section">
    <h2>Goals Progress</h2>
    ${goalRows}
  </div>
  ` : ''}

  <div class="section">
    <h2>Platform Performance</h2>
    <table>
      <thead>
        <tr>
          <th>Platform</th>
          <th>Posts</th>
          <th>Avg Engagement</th>
          <th>Total Reach</th>
        </tr>
      </thead>
      <tbody>
        ${platformRows}
      </tbody>
    </table>
  </div>

  ${analytics.insights.length > 0 ? `
  <div class="section">
    <h2>Insights & Recommendations</h2>
    ${insightRows}
  </div>
  ` : ''}

  <div class="footer">
    Generated on ${new Date().toLocaleString()} | Social Media OS Campaign Report
  </div>
</body>
</html>
    `
  }

  /**
   * Escape CSV special characters
   */
  private static escapeCsv(str: string): string {
    if (str === null || str === undefined) return ''
    const stringValue = String(str)
    if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
      return `"${stringValue.replace(/"/g, '""')}"`
    }
    return stringValue
  }

  /**
   * Escape HTML special characters
   */
  private static escapeHtml(str: string): string {
    if (!str) return ''
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;')
  }

  /**
   * Sanitize filename
   */
  private static sanitizeFilename(filename: string): string {
    return filename
      .replace(/[^a-z0-9]/gi, '_')
      .replace(/_+/g, '_')
      .toLowerCase()
  }

  /**
   * Download file helper
   */
  private static downloadFile(content: string, filename: string, mimeType: string): void {
    const blob = new Blob([content], { type: mimeType })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }
}
