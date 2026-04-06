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
    return this.auditRepository.find({
      relations: ['actor'],
      order: { createdAt: 'DESC' },
      take: 100,
    });
  }

  async findByEntity(entityType: string, entityId: string) {
    return this.auditRepository.find({
      where: { entityType, entityId },
      relations: ['actor'],
      order: { createdAt: 'DESC' },
    });
  }
}