import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuditService } from './audit.service';
import { Reflector } from '@nestjs/core';
import { ActionType } from './audit.entity';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(
    private auditService: AuditService,
    private reflector: Reflector,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest();
    const handler = context.getHandler();

    // Skip audit logging for specified endpoints
    const skipAudit = this.reflector.get<boolean>('skipAudit', handler);
    if (skipAudit) {
      return next.handle();
    }

    const user = request.user;
    const method = request.method;
    const url = request.url;

    return next.handle().pipe(
      tap(async (response) => {
        // Determine action type based on HTTP method
        let actionType: ActionType;
        switch (method) {
          case 'POST':
            actionType = ActionType.CREATE;
            break;
          case 'PATCH':
          case 'PUT':
            // Check if this is a status update
            if (url.includes('/status')) {
              actionType = ActionType.STATUS_CHANGE;
            } else {
              actionType = ActionType.UPDATE;
            }
            break;
          case 'DELETE':
            actionType = ActionType.DELETE;
            break;
          default:
            return; // Skip logging for GET requests
        }

        // Extract entity info from response or request
        const entityType = this.extractEntityType(url);
        const entityId = response?.id || response?.task?.id || request.params?.id;

        if (entityType && entityId && user) {
          await this.auditService.logAction({
            actorId: user.userId,
            actionType,
            entityType,
            entityId,
            relevantData: {
              url,
              method,
              body: request.body,
              response: typeof response === 'object' ? response : { success: true },
              // ADDITION: Extract task-specific data for better formatting
              ...(entityType === 'Tasks' && {
                title: response?.title || request.body?.title || response?.task?.title,
                oldStatus: response?.oldStatus,
                newStatus: response?.status || request.body?.status,
                assignedToId: response?.assignedToId || request.body?.assignedToId,
                assigneeName: response?.assignedTo?.name || response?.assignedTo?.name,
                isAssignmentChange: response?.isAssignmentChange,
              }),
            },
          });
        }
      }),
    );
  }

  private extractEntityType(url: string): string | null {
    // Extract entity type from URL path
    const match = url.match(/\/(\w+)(?:\/|$)/);
    if (match) {
      const entity = match[1];
      // Capitalize first letter
      return entity.charAt(0).toUpperCase() + entity.slice(1);
    }
    return null;
  }
}
