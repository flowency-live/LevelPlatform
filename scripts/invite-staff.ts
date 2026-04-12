#!/usr/bin/env npx ts-node
/**
 * CLI script to invite a staff member
 *
 * Usage:
 *   npx ts-node scripts/invite-staff.ts --email admin@school.uk --name "Sarah Mitchell" --role gatsby-lead
 *
 * Options:
 *   --email    Staff member's email address (required)
 *   --name     Staff member's full name (required)
 *   --role     Role: teacher, senior-teacher, gatsby-lead, asdan-coordinator, head (required)
 *   --tenant   Tenant ID (defaults to TENANT-ARNFIELD)
 *   --type     Staff type: teaching, care (defaults to teaching)
 *
 * Environment Variables:
 *   DYNAMODB_TABLE_NAME  Table name (defaults to elevate-dev)
 *   AWS_REGION           AWS region (defaults to eu-west-2)
 */

import { staffRepository, userAccountRepository } from '../lib/infrastructure/repositories';
import { StaffMember } from '../lib/domain/staff/StaffMember';
import { StaffId } from '../lib/domain/staff/StaffId';
import { TenantId } from '../lib/domain/tenant/TenantId';
import { Role, isRole } from '../lib/domain/staff/Role';
import { StaffType, isStaffType } from '../lib/domain/staff/StaffType';
import { InviteStaff } from '../lib/application/InviteStaff';

function parseArgs(args: string[]): Record<string, string> {
  const result: Record<string, string> = {};
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg.startsWith('--') && args[i + 1] && !args[i + 1].startsWith('--')) {
      result[arg.slice(2)] = args[i + 1];
      i++;
    }
  }
  return result;
}

function generateStaffId(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let id = 'STAFF-';
  for (let i = 0; i < 6; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return id;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));

  if (!args.email || !args.name || !args.role) {
    console.error('Usage: npx ts-node scripts/invite-staff.ts --email EMAIL --name NAME --role ROLE');
    console.error('');
    console.error('Required options:');
    console.error('  --email    Staff member email address');
    console.error('  --name     Staff member full name');
    console.error('  --role     Role: teacher, senior-teacher, gatsby-lead, asdan-coordinator, head');
    console.error('');
    console.error('Optional:');
    console.error('  --tenant   Tenant ID (default: TENANT-ARNFIELD)');
    console.error('  --type     Staff type: teaching, care (default: teaching)');
    console.error('');
    console.error('Environment:');
    console.error('  DYNAMODB_TABLE_NAME  Table name (default: elevate-dev)');
    console.error('  AWS_REGION           AWS region (default: eu-west-2)');
    process.exit(1);
  }

  const email = args.email;
  const name = args.name;
  const roleStr = args.role;
  const tenantId = args.tenant || 'TENANT-ARNFIELD';
  const staffTypeStr = args.type || 'teaching';

  if (!isRole(roleStr)) {
    console.error(`Invalid role: ${roleStr}`);
    console.error('Valid roles: teacher, senior-teacher, gatsby-lead, asdan-coordinator, head');
    process.exit(1);
  }

  if (!isStaffType(staffTypeStr)) {
    console.error(`Invalid staff type: ${staffTypeStr}`);
    console.error('Valid types: teaching, care');
    process.exit(1);
  }

  const role = roleStr as Role;
  const staffType = staffTypeStr as StaffType;

  const staffId = StaffId.create(generateStaffId());

  const staff = StaffMember.create({
    id: staffId,
    schoolId: TenantId.create(tenantId),
    name,
    email,
    staffType,
    roles: [role],
  });

  console.log(`Using DynamoDB table: ${process.env.DYNAMODB_TABLE_NAME || 'elevate-dev'}`);
  console.log(`Creating staff member: ${staffId.toString()}`);

  await staffRepository.save(staff);
  console.log(`Staff member saved to DynamoDB`);

  const inviteStaff = new InviteStaff(staffRepository, userAccountRepository);

  try {
    const result = await inviteStaff.execute({
      staffId: staffId.toString(),
    });

    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const setupUrl = `${baseUrl}/setup/${result.inviteToken}`;

    console.log('');
    console.log('Invite created successfully!');
    console.log('');
    console.log('Staff Details:');
    console.log(`  Name:   ${name}`);
    console.log(`  Email:  ${email}`);
    console.log(`  Role:   ${role}`);
    console.log(`  ID:     ${staffId.toString()}`);
    console.log('');
    console.log('Magic Link (expires in 7 days):');
    console.log(`  ${setupUrl}`);
    console.log('');
    console.log('Send this link to the staff member to complete registration.');
  } catch (error) {
    console.error('Failed to create invite:', error);
    process.exit(1);
  }
}

main().catch(console.error);
