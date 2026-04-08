import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLog, ActionType } from './audit.entity';

@Injectable()
export class AuditService {
  constructor(
    @InjectRepository(AuditLog)
    private auditRepository: Repository<AuditLog>,
  ) {}

  async logAction(data: {
    actorId: string;
    actionType: ActionType;
    entityType: string;
    entityId: string;
    relevantData: Record<string, any>;
  }) {
    const auditLog = this.auditRepository.create(data);
    return this.auditRepository.save(auditLog);
  }

  async findAll() {
    const logs = await this.auditRepository.find({
      relations: ['actor'],
      order: { createdAt: 'DESC' },
      take: 100,
    });

    return logs.map(log => this.formatAuditLog(log));
  }

  private formatAuditLog(log: AuditLog) {
    const timestamp = this.formatTimestamp(log.createdAt);
    const username = log.actor.name || log.actor.email.split('@')[0];
    const { action, details } = this.formatActionAndDetails(log);

    return {
      id: log.id,
      timestamp,
      username,
      action,
      details,
      entityType: log.entityType,
      entityId: log.entityId,
      actor: log.actor,
      createdAt: log.createdAt,
      actionType: log.actionType,
      relevantData: log.relevantData,
    };
  }

  private formatTimestamp(date: Date): string {
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    const formattedHours = String(hours).padStart(2, '0');

    return `${month}/${day}/${year} ${formattedHours}:${minutes} ${ampm}`;
  }

  private formatActionAndDetails(log: AuditLog): { action: string; details: string } {
    const data = log.relevantData || {};

    switch (log.actionType) {
      case ActionType.CREATE:
        if (log.entityType === 'Tasks') {
          // If task was created with an assignee, show assignment in details
          if (data.assignedToId || data.assigneeName) {
            return {
              action: 'Task Created',
              details: `"${data.title || 'N/A'}" to ${data.assigneeName || 'Unassigned'}`,
            };
          }
          // Task created without assignee
          return {
            action: 'Task Created',
            details: `"${data.title || 'N/A'}"`,
          };
        }
        return {
          action: 'Created',
          details: `${log.entityType} Created`,
        };

      case ActionType.UPDATE:
        if (log.entityType === 'Tasks') {
          // Check if this is an assignment change
          if (data.isAssignmentChange || data.changes?.assignedToId || data.assignedToId) {
            return {
              action: 'Task Assigned',
              details: `"${data.title || 'N/A'}" to ${data.assigneeName || 'Unassigned'}`,
            };
          }
          // For other updates, use generic message
          return {
            action: 'Task Updated',
            details: `"${data.title || 'N/A'}" updated`,
          };
        }
        return {
          action: 'Updated',
          details: `${log.entityType} Updated`,
        };

      case ActionType.DELETE:
        if (log.entityType === 'Tasks') {
          return {
            action: 'Task Deleted',
            details: `"${data.title || 'N/A'}"`, // Just title in quotes
          };
        }
        return {
          action: 'Deleted',
          details: `${log.entityType} Deleted`,
        };

      case ActionType.STATUS_CHANGE:
        return {
          action: 'Status Changed',
          details: `"${data.title || 'N/A'}" from "${this.formatStatus(data.oldStatus)}" to "${this.formatStatus(data.newStatus)}"`,
        };

      case ActionType.ASSIGNMENT_CHANGE:
        // Keep this for backward compatibility
        return {
          action: 'Task Assigned',
          details: `"${data.title || 'N/A'}" to ${data.assigneeName || 'Unassigned'}`,
        };

      default:
        return {
          action: log.actionType,
          details: `${log.actionType} on ${log.entityType}`,
        };
    }
  }

  private formatStatus(status: string): string {
    const statusMap: Record<string, string> = {
      'TODO': 'Todo',
      'PENDING': 'Pending',
      'PROCESSING': 'In Progress',
      'DONE': 'Done',
    };
    return statusMap[status] || status;
  }

  async findByEntity(entityType: string, entityId: string) {
    const logs = await this.auditRepository.find({
      where: { entityType, entityId },
      relations: ['actor'],
      order: { createdAt: 'DESC' },
    });

    return logs.map(log => this.formatAuditLog(log));
  }
}