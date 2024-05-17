// import { prismaReportsRepository } from "../../infra/database/repositories/prisma-reports-repository";
// import fs from "fs";
// import path from "path";
// import capitalizeName from "../../core/utils/capitalizeName";
// import toBrazilianDate from "../../core/utils/toBrazilianDate";
// import getLevelIconPng from "../../core/utils/getLevelIconPng";
// const pdfDocument = require("pdfkit-table");
// export default async (
//   reportId: string
// ): Promise<{ buffer: Buffer; swimmerName: string }> => {
//   console.log("reportId", reportId);
//   const report = await prismaReportsRepository.findReportsAndAreasAndSteps(
//     reportId
//   );

//   if (!report) {
//     throw new Error("Report not found");
//   }
//   const swimmer = report.swimmer;

//   const doc = new pdfDocument({
//     size: "A4",
//     margins: {
//       top: 75,
//       bottom: 50,
//       left: 50,
//       right: 50,
//     },
//     info: {
//       Title: "Relatório de acompanhamento",
//     },
//   });

//   const pathLevel = path.join(
//     __dirname,
//     "images",
//     getLevelIconPng(report.levelNumber)
//   );

//   const pathLogo = path.join(__dirname, "images", "logo-nade-bem.png");
//   const docWidth = doc.page.width;

//   const imageWidth = 70;

//   doc.image(pathLevel, 50, 50, { width: imageWidth });

//   // Text in the center
//   doc.fontSize(15).text("Relatório de acompanhamento", {
//     align: "center",
//     lineGap: 10,
//   });

//   // Image on the right
//   doc.image(pathLogo, docWidth - imageWidth - 50, 50, {
//     width: imageWidth,
//   });

//   // Dados fictícios
//   const periodoDe = toBrazilianDate(report.period.startDate);
//   const periodoAte = toBrazilianDate(report.period.endDate);

//   // Adicionando os dados ao PDF
//   doc.fontSize(12).text(`Nome: ${capitalizeName(swimmer.name)}`, 50, 110);
//   doc.text(`Período de: ${periodoDe} a ${periodoAte}`, docWidth / 2, 110);

//   const texto = `Este relatório tem como objetivo compartilhar com os pais o progresso de seus filhos na piscina, independentemente da quantidade de aulas frequentadas. Os níveis de habilidade de 1 a 3 indicam a evolução gradual das atividades propostas, com mais por vir nos próximos relatórios. Celebramos juntos cada conquista aquática!`;
//   doc.text(texto, 50, 130, { width: 500, align: "justify" });

//   const options = {
//     columnsSize: [100, 350, 50],
//     align: "center",
//     x: 50,
//     y: 210,
//     prepareHeader: () => {
//       doc.fontSize(10);
//     },
//     prepareRow: () => {
//       doc.fontSize(10);
//     },
//   };
//   const table = {
//     headers: [
//       {
//         label: "Áreas",
//         property: "areas",
//         align: "center",
//         headerAlign: "center",
//       },
//       {
//         label: "Passos",
//         property: "passos",
//         align: "left",
//         headerAlign: "center",
//       },
//       {
//         label: "Passo",
//         property: "passo",
//         align: "center",
//         headerAlign: "center",
//       },
//     ],
//     rows: report.areas.map((area) => [
//       area.title,
//       area.steps
//         .map((step) => step.points + ". " + step.description)
//         .join("\n"),
//       area.steps.find((step) => step.id === area.lastReportStepId)?.points ??
//         "",
//     ]),
//   };

//   doc.fontSize(12).table(table, options);

//   doc.fontSize(12).text("Observações:", 50, 540);
//   doc.fontSize(10).text(report.observation, 50, 560);

//   // Dados fictícios
//   const professor = `Prof. ${capitalizeName(report.teacher.name)}`;
//   const coordenador = "Jovir Demari";

//   // Adicionando os dados ao PDF
//   doc.fontSize(12).text(`Professor(a): ${professor}`, 50, 720);
//   doc.text(`Coordenador: ${coordenador}`, 300, 720);

//   const pathRaiarLogo = path.join(__dirname, "images", "logo-raiar.png");

//   doc.image(pathRaiarLogo, (docWidth - imageWidth) / 2, 740, {
//     width: imageWidth,
//   });

//   doc.end();

//   const buffer = await new Promise<Buffer>((resolve, reject) => {
//     const buffers: Buffer[] = [];
//     doc.on("data", buffers.push.bind(buffers));
//     doc.on("end", () => resolve(Buffer.concat(buffers)));
//     doc.on("error", reject);
//   });

//   console.log("pdf created");

//   return { buffer: buffer, swimmerName: swimmer.name };
// };
