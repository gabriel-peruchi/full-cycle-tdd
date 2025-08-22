import { CreateBookingDTO } from "../../application/dtos/create_booking_dto";
import { BookingService } from "../../application/services/booking_service";
import { Request, Response } from "express";
import { UserService } from "../../application/services/user_service";

export class UserController {
  private userService: UserService

  constructor(userService: UserService) {
    this.userService = userService;
  }

  async createUser(req: Request, res: Response): Promise<Response> {
    try {
      const name = req.body.name

      if (!name) {
        return res
          .status(400)
          .json({ message: "O campo nome é obrigatório." })
      }

      const user = await this.userService.createUser({ name })

      return res.status(201).json({
        message: "User created successfully",
        user: {
          id: user.getId(),
          name: user.getName()
        },
      });
    } catch (error: any) {
      return res
        .status(400)
        .json({ message: error.message || "An unexpected error occurred" });
    }
  }
}
