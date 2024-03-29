import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import reportService from '../reportService';
import { saveAs } from 'file-saver';
import * as ExcelJS from 'exceljs';
import { MOHIMAGELOG } from 'src/assets/imageBytes';
import useUtils from 'src/use/useUtils';

const reportName = 'PacientesActivosEmDDD';
const logoTitle =
  'REPÚBLICA DE MOÇAMBIQUE \n MINISTÉRIO DA SAÚDE \n SERVIÇO NACIONAL DE SAÚDE';
const title = 'Pacientes Inscritos em DDD (Modelo DDD)';
const fileName = reportName.concat(
  '_' + useUtils.getDateFormatDDMMYYYY(new Date())
);

export default {
  async downloadPDF(
    facility: string,
    province: string,
    startDate: string,
    endDate: string,
    params: object,
    loadingPDF: object
  ) {
    const doc = new jsPDF({
      orientation: 'l',
      unit: 'mm',
      format: [210, 390],
      putOnlyUsedFonts: true,
      floatPrecision: 'smart', // or "smart", default is 16
    });
    loadingPDF.value = true;
    const image = new Image();
    // image.src = '/src/assets/MoHLogo.png';
    image.src = 'data:image/png;base64,' + MOHIMAGELOG;
    const width = doc.internal.pageSize.getWidth();
    /*
      Fill Table
    */
    const cols = [
      'Ordem',
      'NID',
      'Data Referência',
      'Mêses no MDD',
      'Ultima Data Levant. US',
      'Data Prox. Levant. US',
      'Primeiro Levant. FP',
      'Prox. Levant. FP',
      'Dias de Atraso ao 1º Levant',
      'Data Prox. Levant. no Período',
      'Farmácia',
      'Unidade Sanitária',
      'Província',
      'Distrito',
    ];
    const rows = await reportService.getActivePatientsInDDM(params);
    const data = this.createArrayOfArrayRow(rows);

    autoTable(doc, {
      margin: { top: 60 },
      columnStyles: {
        0: { cellWidth: 18 },
        1: { cellWidth: 35 },
        2: { cellWidth: 25 },
        3: { cellWidth: 15 },
        4: { cellWidth: 25 },
        5: { cellWidth: 25 },
        6: { cellWidth: 25 },
        7: { cellWidth: 25 },
        8: { cellWidth: 20 },
        9: { cellWidth: 25 },
        10: { cellWidth: 30 },
        11: { cellWidth: 30 },
        12: { cellWidth: 30 },
        13: { cellWidth: 30 },
      },
      bodyStyles: {
        halign: 'center',
      },
      headStyles: {
        halign: 'center',
        valign: 'middle',
      },
      didDrawPage: function (data) {
        // Header
        doc.setFontSize(10);
        doc.setTextColor(40);
        doc.addImage(image, 'PNG', data.settings.margin.left + 15, 5, 25, 25);
        doc.text('REPÚBLICA DE MOÇAMBIQUE', data.settings.margin.left + 2, 35);
        doc.text('MINISTÉRIO DA SAÚDE', data.settings.margin.left + 7, 40);
        doc.text('SERVIÇO NACIONAL DE SAÚDE', data.settings.margin.left, 45);
        doc.setFontSize(16);
        doc.text('Pacientes Activos em DDD (Modelo DDD)', width / 2, 40, {
          align: 'center',
        });
        doc.setFontSize(10);
        doc.text('Província: ' + province, 15, 57);
        params.value.district !== null && params.value.district !== undefined
          ? doc.text(
              'Distrito: ' + params.value.district.name,
              width / 3 - 15,
              57
            )
          : '';
        params.value.clinic !== null && params.value.clinic !== undefined
          ? doc.text(
              'Farmácia: ' + params.value.clinic.clinicname,
              width / 2 + 30,
              57
            )
          : '';
        doc.text('Data Início: ' + startDate, width / 2 + 98, 49);
        doc.text('Data Fim: ' + endDate, width / 2 + 98, 57);
        // doc.line(0, 35, 400, 50);
      },
      theme: 'grid',
      head: [cols],
      body: data,
    });
    loadingPDF.value = false;
    return doc.save(fileName.concat('.pdf'));
  },
  async downloadExcel(
    facility: string,
    province: string,
    startDate: string,
    endDate: string,
    params: object,
    loadingXLS: object
  ) {
    facility =
      params.value.clinic !== null && params.value.clinic !== undefined
        ? params.value.clinic.clinicname
        : '';
    loadingXLS.value = true;
    const rows = await reportService.getActivePatientsInDDM(params);
    const data = this.createArrayOfArrayRow(rows);

    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'FGH';
    workbook.lastModifiedBy = 'FGH';
    workbook.created = new Date();
    workbook.modified = new Date();
    workbook.lastPrinted = new Date();

    // Force workbook calculation on load
    //workbook.calcProperties.fullCalcOnLoad = true;
    const worksheet = workbook.addWorksheet(reportName);
    const imageId = workbook.addImage({
      base64: 'data:image/png;base64,' + MOHIMAGELOG,
      extension: 'png',
    });
    // Get Cells
    const cellRepublica = worksheet.getCell('A8');
    const cellTitle = worksheet.getCell('A9');
    const cellPharm = worksheet.getCell('A11');
    const cellDistrict = worksheet.getCell('A12');
    const cellProvince = worksheet.getCell('E12');
    const cellStartDate = worksheet.getCell('M11');
    const cellEndDate = worksheet.getCell('M12');
    const cellPharmParamValue = worksheet.getCell('B11');
    const cellDistrictParamValue = worksheet.getCell('B12');
    const cellProvinceParamValue = worksheet.getCell('F12');
    const cellStartDateParamValue = worksheet.getCell('N11');
    const cellEndDateParamValue = worksheet.getCell('N12');

    // Get Rows
    const headerRow = worksheet.getRow(15);

    //Get Columns
    const colA = worksheet.getColumn('A');
    const colB = worksheet.getColumn('B');
    const colC = worksheet.getColumn('C');
    const colD = worksheet.getColumn('D');
    const colE = worksheet.getColumn('E');
    const colF = worksheet.getColumn('F');
    const colG = worksheet.getColumn('G');
    const colH = worksheet.getColumn('H');
    const colI = worksheet.getColumn('I');
    const colJ = worksheet.getColumn('J');
    const colK = worksheet.getColumn('K');
    const colL = worksheet.getColumn('L');
    const colM = worksheet.getColumn('M');
    const colN = worksheet.getColumn('N');
    const colO = worksheet.getColumn('O');

    // Format Table Cells
    // Alignment Format
    cellRepublica.alignment =
      cellTitle.alignment =
      headerRow.alignment =
        {
          vertical: 'middle',
          horizontal: 'center',
          wrapText: true,
        };

    cellPharm.alignment =
      cellDistrict.alignment =
      cellProvince.alignment =
      cellStartDate.alignment =
      cellEndDate.alignment =
        {
          vertical: 'middle',
          horizontal: 'left',
          wrapText: false,
        };

    // Border Format
    cellRepublica.border =
      cellTitle.border =
      cellPharm.border =
      cellDistrictParamValue.border =
      cellDistrict.border =
      cellPharmParamValue.border =
      cellProvince.border =
      cellProvinceParamValue.border =
      cellStartDate.border =
      cellStartDateParamValue.border =
      cellEndDate.border =
      cellEndDateParamValue.border =
        {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };

    // Assign Value to Cell
    cellRepublica.value = logoTitle;
    cellTitle.value = title;
    cellPharmParamValue.value = facility;
    cellProvinceParamValue.value = province;
    cellDistrictParamValue.value =
      params.value.district !== null && params.value.district !== undefined
        ? params.value.district.name
        : '';
    cellStartDateParamValue.value = startDate;
    cellEndDateParamValue.value = endDate;
    cellPharm.value = 'Farmácia';
    cellDistrict.value = 'Distrito';
    cellProvince.value = 'Província';
    cellStartDate.value = 'Data Início';
    cellEndDate.value = 'Data Fim';

    // merge a range of cells
    worksheet.mergeCells('A1:A7');
    worksheet.mergeCells('A9:N10');
    worksheet.mergeCells('B11:L11');
    worksheet.mergeCells('B12:D12');
    worksheet.mergeCells('F12:L12');
    worksheet.mergeCells('A13:N13');
    // worksheet.mergeCells('A13:L13');
    // worksheet.mergeCells('A13:M13');
    // worksheet.mergeCells('A13:N13');
    // worksheet.mergeCells('A13:O13');

    // add width size to Columns
    // add height size to Rows
    headerRow.height = 30;

    // add height size to Columns
    // add width size to Columns
    colA.width = 30;
    colB.width = 20;
    colC.width = 40;
    colD.width = 10;
    colE.width = 20;
    colF.width = 15;
    colG.width = 15;
    colH.width = 15;
    colI.width = 15;
    colJ.width = 15;
    colK.width = 15;
    colL.width = 15;
    colM.width = 15;
    colN.width = 15;
    colO.width = 15;

    // Add Style
    cellTitle.font =
      cellDistrict.font =
      cellProvince.font =
      cellStartDate.font =
      cellEndDate.font =
      cellPharm.font =
        {
          name: 'Arial',
          family: 2,
          size: 11,
          italic: false,
          bold: true,
        };

    // Add Image
    worksheet.addImage(imageId, {
      tl: { col: 0, row: 1 },
      ext: { width: 144, height: 98 },
    });

    // Cereate Table
    worksheet.addTable({
      name: reportName,
      ref: 'A14',
      headerRow: true,
      totalsRow: false,
      style: {
        showRowStripes: false,
      },
      columns: [
        { name: 'Ordem', totalsRowLabel: 'Totals:', filterButton: false },
        { name: 'NID', totalsRowFunction: 'none', filterButton: false },
        {
          name: 'Data de Referência',
          totalsRowFunction: 'none',
          filterButton: false,
        },
        {
          name: 'Mêses no MDD',
          totalsRowFunction: 'none',
          filterButton: false,
        },
        {
          name: 'Ultima Data Levant. US',
          totalsRowFunction: 'none',
          filterButton: false,
        },
        {
          name: 'Data Prox. Levant. US',
          totalsRowFunction: 'none',
          filterButton: false,
        },
        {
          name: 'Primeiro Levant. FP',
          totalsRowFunction: 'none',
          filterButton: false,
        },
        {
          name: 'Prox. Levant. FP',
          totalsRowFunction: 'none',
          filterButton: false,
        },
        {
          name: 'Dias de Atraso ao 1º Levant',
          totalsRowFunction: 'none',
          filterButton: false,
        },
        {
          name: 'Data Prox. Levant. no Período',
          totalsRowFunction: 'none',
          filterButton: false,
        },
        {
          name: 'Farmácia',
          totalsRowFunction: 'none',
          filterButton: false,
        },
        {
          name: 'Unidade Sanitária',
          totalsRowFunction: 'none',
          filterButton: false,
        },
        {
          name: 'Província',
          totalsRowFunction: 'none',
          filterButton: false,
        },
        {
          name: 'Distrito',
          totalsRowFunction: 'none',
          filterButton: false,
        },
      ],
      rows: data,
    });

    // Format all data cells
    const lastRowNum =
      worksheet.lastRow.number !== undefined ? worksheet.lastRow.number : 0;
    const lastTableRowNum = lastRowNum;

    //Loop through all table's row
    for (let i = 14; i <= lastTableRowNum; i++) {
      const row = worksheet.getRow(i);

      //Now loop through every row's cell and finally set alignment
      row.eachCell({ includeEmpty: true }, (cell) => {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
        cell.alignment = {
          vertical: 'middle',
          horizontal: 'center',
          wrapText: true,
        };
        if (i == 14) {
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: '1fa37b' },
            bgColor: { argb: '1fa37b' },
          };
          cell.font = {
            name: 'Arial',
            color: { argb: 'FFFFFFFF' },
            family: 2,
            size: 11,
            italic: false,
            bold: true,
          };
        }
      });
    }

    const buffer = await workbook.xlsx.writeBuffer();
    const fileType =
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    const fileExtension = '.xlsx';

    const blob = new Blob([buffer], { type: fileType });
    loadingXLS.value = false;

    saveAs(blob, fileName + fileExtension);
  },
  createArrayOfArrayRow(rows: any) {
    const data = [];
    let Ordem = 1;

    for (const row in rows) {
      const createRow = [];
      createRow.push(Ordem);
      createRow.push(rows[row].patientid);
      createRow.push(
        useUtils.getDateFormatDDMMYYYYFromYYYYMMDD(rows[row].refdate)
      );
      createRow.push(rows[row].numberofmonthsinddd);
      createRow.push(
        useUtils.getDateFormatDDMMYYYYFromYYYYMMDD(rows[row].lastuspickupdate)
      );
      createRow.push(
        useUtils.getDateFormatDDMMYYYYFromYYYYMMDD(
          rows[row].lastusnextpickupdate
        )
      );
      createRow.push(
        useUtils.getDateFormatDDMMYYYYFromYYYYMMDD(rows[row].firstfppickupdate)
      );
      createRow.push(
        useUtils.getDateFormatDDMMYYYYFromYYYYMMDD(
          rows[row].firstfpnextpickupdate
        )
      );
      createRow.push(rows[row].missedpickupdays);
      createRow.push(
        useUtils.getDateFormatDDMMYYYYFromYYYYMMDD(
          rows[row].expecteddateinreportperiod
        )
      );
      createRow.push(rows[row].clinicname);
      createRow.push(rows[row].facilityname);
      createRow.push(rows[row].province);
      createRow.push(rows[row].district);

      data.push(createRow);
      Ordem += 1;
    }

    return data;
  },
};
