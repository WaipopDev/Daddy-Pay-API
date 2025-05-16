import { SetMetadata } from '@nestjs/common';

export const Permissions = (...permissions: string[]): ClassDecorator & MethodDecorator => {
  return SetMetadata('rolePermissions', ['super_admin', ...permissions]);
};
