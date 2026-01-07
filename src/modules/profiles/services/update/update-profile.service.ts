import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ProfileEntity } from "../../entities/profile.entity";
import { UpdateProfileInputDto } from "../../dtos/update/update-profile-input.dto";
import { UpdateProfileResponseDto } from "../../dtos/update/update-profile-response.dto";
import { UpdateProfileValidator } from "../../validators/update/update-profile.validator";

@Injectable()
export class UpdateProfileService {
  constructor(
    @InjectRepository(ProfileEntity)
    private readonly profileRepository: Repository<ProfileEntity>
  ) {}

  async execute(
    userId: string,
    input: UpdateProfileInputDto,
    ipAddress?: string,
    userAgent?: string
  ): Promise<UpdateProfileResponseDto> {

    UpdateProfileValidator.validate(input);

    const profile = await UpdateProfileValidator.ensureProfileExists(
      userId,
      this.profileRepository
    );

    profile.phone = input.phone ?? profile.phone;
    profile.currentWeight = input.currentWeight ?? profile.currentWeight;
    profile.currentHeight = input.currentHeight ?? profile.currentHeight;
    profile.currentImc = input.currentImc ?? profile.currentImc;
    profile.birthDate = input.birthDate ?? profile.birthDate;
    profile.sex = input.sex ?? profile.sex;
    profile.activityLevel = input.activityLevel ?? profile.activityLevel;
    profile.goal = input.goal ?? profile.goal;
    profile.ipAddress = ipAddress ?? profile.ipAddress;
    profile.userAgent = userAgent ?? profile.userAgent;

    const updated = await this.profileRepository.save(profile);

    return {
      idProfiles: updated.idProfiles,
      phone: updated.phone,
      currentWeight: updated.currentWeight,
      currentHeight: updated.currentHeight,
      currentImc: updated.currentImc,
      birthDate: updated.birthDate,
      sex: updated.sex,
      activityLevel: updated.activityLevel,
      goal: updated.goal,
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt,
    };
  }
}