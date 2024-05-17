// import { Response } from "express";
// import RefreshSwimmersUseCase from "../../../../domain/use-cases/RefreshSwimmersUseCase";
// import { AuthenticatedRequest } from "../../../auth/AuthenticatedRequest";

// export default async (req: AuthenticatedRequest, res: Response) => {
//   try {
//     if (req.user?.profile === "teacher") {
//       await RefreshSwimmersUseCase({ teacherNumber: req.user.userId });
//     }
//     res.status(200).json({ message: "Refreshing..." });

//     console.log("refreshed");
//   } catch (error) {
//     console.log(error);
//     res.status(400).json({ message: "Error refreshing" });
//   }
// };
