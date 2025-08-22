import { Request, Response } from "express";
import { UserService } from "../../application/services/user_service";
import { PropertyService } from "../../application/services/property_service";

export class PropertyController {
  private propertyService: PropertyService

  constructor(propertyService: PropertyService) {
    this.propertyService = propertyService;
  }

  async createProperty(req: Request, res: Response): Promise<Response> {
    try {
      const name = req.body.name
      const maxGuests = req.body.maxGuests
      const description = req.body.description
      const basePricePerNight = req.body.basePricePerNight

      if (!name) {
        return res
          .status(400)
          .json({ message: "O nome da propriedade é obrigatório." })
      }

      if (!maxGuests || maxGuests <= 0) {
        return res
          .status(400)
          .json({ message: "A capacidade máxima deve ser maior que zero." })
      }

      if (!description) {
        return res
          .status(400)
          .json({ message: "A descrição é obrigatória." })
      }

      if (!basePricePerNight) {
        return res
          .status(400)
          .json({ message: "O preço base por noite é obrigatório." })
      }

      const property = await this.propertyService.createProperty({ 
        name, 
        maxGuests, 
        description, 
        basePricePerNight 
      })

      return res.status(201).json({
        message: "Property created successfully",
        property: {
          id: property.getId(),
          name: property.getName(),
          maxGuests: property.getMaxGuests(),
          description: property.getDescription(),
          basePricePerNight: property.getBasePricePerNight()
        },
      });
    } catch (error: any) {
      return res
        .status(400)
        .json({ message: error.message || "An unexpected error occurred" });
    }
  }
}
