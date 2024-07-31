import {
  Area,
  Level,
  Period,
  Report,
  Step,
  Swimmer,
  Teacher,
} from '@prisma/client';
const path = require('path');
import getLevelIconPng from '../../../core/utils/getLevelIconPng';
import capitalizeName from '../../../core/utils/capitalizeName';
import toBrazilianDate from '../../../core/utils/toBrazilianDate';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PrintReportService {
  constructor() {}

  execute({
    doc,
    report,
  }: {
    doc: any;
    report: {
      observation: string;
      swimmer: Swimmer;
      teacher: Teacher;
      period: Period;
      areas: ({
        lastReportStepId: string;
        steps: Step[];
      } & Area)[];
    } & Level;
  }): void {
    const swimmer = report.swimmer;

    const imageWidth = 70;
    const docWidth = doc.page.width;

    const pathLevel = path.join(
      process.cwd(),
      'public',
      'images',
      getLevelIconPng(report.levelNumber),
    );
    doc.image(pathLevel, 50, 50, { width: imageWidth });

    doc.fontSize(15).text('Relatório de acompanhamento', {
      align: 'center',
      lineGap: 10,
    });

    const pathLogo = path.join(
      process.cwd(),
      'public',
      'images',
      'logo-nade-bem.png',
    );
    // Image on the right
    doc.image(pathLogo, docWidth - imageWidth - 50, 50, {
      width: imageWidth,
    });

    // Dados fictícios

    // Adicionando os dados ao PDF
    doc.fontSize(12).text(`Nome: ${capitalizeName(swimmer.name, 30)}`, 50, 110);

    const periodoDe = toBrazilianDate(new Date(2024, 0, 17));
    const periodoAte = toBrazilianDate(new Date(2024, 4, 16));
    doc.text(`Período de: ${periodoDe} a ${periodoAte}`, docWidth / 2, 110);

    const texto = `Este relatório tem como objetivo compartilhar com os pais o progresso de seus filhos na piscina, independentemente da quantidade de aulas frequentadas. Os níveis de habilidade de 1 a 3 indicam a evolução gradual das atividades propostas, com mais por vir nos próximos relatórios. Celebramos juntos cada conquista aquática!`;
    doc.text(texto, 50, 130, { width: 500, align: 'justify' });

    const options = {
      columnsSize: [100, 350, 50],
      align: 'center',
      x: 50,
      y: 210,
      prepareHeader: () => {
        doc.fontSize(10);
      },
      prepareRow: () => {
        doc.fontSize(10);
      },
    };
    const table = {
      headers: [
        {
          label: 'Áreas',
          property: 'areas',
          align: 'center',
          headerAlign: 'center',
        },
        {
          label: 'Passos',
          property: 'passos',
          align: 'left',
          headerAlign: 'center',
        },
        {
          label: 'Passo',
          property: 'passo',
          align: 'center',
          headerAlign: 'center',
        },
      ],
      rows: report.areas.map((area) => [
        area.title,
        area.steps
          .map((step) => step.points + '. ' + step.description)
          .join('\n'),
        area.steps.find((step) => step.id === area.lastReportStepId)?.points ??
          '',
      ]),
    };

    doc.fontSize(12).table(table, options);

    doc
      .fontSize(12)
      .text('Observações:', 50, 210 + report.areas.length * 40 + 45);
    doc
      .fontSize(10)
      .text(report.observation, 50, 210 + report.areas.length * 40 + 65);

    // Dados fictícios
    const coordenador = 'Jovir Demari';

    const professor = `Prof. ${capitalizeName(report.teacher.name, 30)}`;

    // Adicionando os dados ao PDF
    doc.fontSize(12).text(`Professor(a): ${professor}`, 50, 720);
    doc.text(`Coordenador: ${coordenador}`, 300, 720);

    const pathRaiarLogo = path.join(
      process.cwd(),
      'public',
      'images',
      'logo-raiar.png',
    );
    doc.image(pathRaiarLogo, (docWidth - imageWidth) / 2, 740, {
      width: imageWidth,
    });
  }
}
