// import { Response } from 'express';
// import generateReportPdfBySwimmer from '../../../../domain/use-cases/generateReportPdfBySwimmer';
// import { AuthenticatedRequest } from '../../../auth/AuthenticatedRequest';

// export default async (
//   req: AuthenticatedRequest & { params: { reportId: string } },
//   res: Response,
// ) => {
//   try {
//     const { reportId } = req.params;

//     const report = await generateReportPdfBySwimmer(reportId);

//     const swimmer = report.swimmerName;

//     res.setHeader('Content-Type', 'application/pdf');
//     res.set(
//       'Content-Disposition',
//       `attachment; filename=${swimmer.split(' ')[0]}-${
//         swimmer.split(' ').length > 1 ? swimmer.split(' ')[1] : ''
//       }-avaliacao-2024-1.pdf`,
//     );

//     return res.end(report.buffer);
//   } catch (e) {
//     console.log(e);
//     return res.status(500).json({ message: 'Internal server error' });
//   }
// };
