import { IUser, PrismaUserModel } from '../../core/types';
import billingInfoResource from '../../billing-info/billing-info-transformer/billing-info.transformer';
import employeeCollection from '../../employee-info/employee-transformer/employee.collection';
import employeeResource from '../../employee-info/employee-transformer/employee.resource';
import userSocialMediaResource from '../../user-social-medias/social-media-transformer/social-media.resource';
import { Transformer } from '../../core/transformer/transformer';

class UserResource implements Transformer {
  transform(user: PrismaUserModel): IUser {
    return {
      id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      fathers_name: user.fathers_name ?? null,
      mothers_name: user.mothers_name ?? null,
      userName: user.userName,
      email: user.email,
      dob: user.dob || null,
      blood_group: user.blood_group || null,
      contact_number: user.contact_number || null,
      emergency_contact_number: user.emergency_contact_number || null,
      nid: user?.nid || null,
      permanent_address: user.permanent_address || null,
      present_address: user.present_address,
      tshirt: user.tshirt || null,
      tin_number: user.tin_number || null,
      gender: user.gender,
      marital_status: user.marital_status || null,
      religion: user.religion,
      profile_picture: user.profile_picture,
      is_registered: user.is_registered,
      employment_infos: user.employment_infos
        ? employeeCollection.transformCollection(user.employment_infos)
        : null,
      reporting_officers: user.reporting_officers
        ? employeeCollection.transformCollection(user.reporting_officers)
        : null,
      current_employment_info: user.current_employment_info
        ? employeeResource.transform(user.current_employment_info)
        : null,
      current_employee_id: user.current_employee_id || null,
      roles: user.user_roles
        ? user.user_roles
            .map((user_role) => user_role.role)
            .map((role) => ({ id: role.id, name: role.name }))
        : null,
      social_media: user.social_media
        ? userSocialMediaResource.transform(user.social_media)
        : null,
      billing_info: user.billing_info
        ? billingInfoResource.transform(user.billing_info)
        : null,
    };
  }
}

const userResource = new UserResource();

export default userResource;
