<template>
  <div ref="filterDrugStoreSection">
    <Bar
      :addVisible="false"
      :mainContainer="true"
      :closeVisible="true"
      @closeSection="closeSection"
      bgColor="bg-orange-5"
    >
      {{ title }}
    </Bar>
    <div class="param-container">
      <q-item>
        <q-item-section class="col">
          <FiltersInput @generateReport="generateReport" />
        </q-item-section>
      </q-item>
    </div>
  </div>
</template>

<script setup>
/*
  Imports
  */
// import reportService from 'src/services/ReportServices/reportService';
import { provide, reactive, ref } from 'vue';
import FiltersInput from 'src/components/Reports/Shared/FiltersInput.vue';
import Bar from 'src/components/Shared/Bar.vue';
import reportPatientWithClinicInfo from 'src/services/ReportServices/clinicInfo/reportPatientWithClinicInfo';
import useUtils from 'src/use/useUtils';

const title = ref('Lista de Pacientes com Atenção Farmaceutica');
const loadingPDF = reactive(ref(false));
const loadingXLS = reactive(ref(false));

const generateReport = (params) => {
  if (params.value.fileType === 'PDF') {
    reportPatientWithClinicInfo.downloadPDF(
      null,
      params.value.province.name,
      useUtils.getDateFormatDDMMYYYYDash(params.value.startDate),
      useUtils.getDateFormatDDMMYYYYDash(params.value.endDate),
      params,
      loadingPDF
    );
  } else {
    reportPatientWithClinicInfo.downloadExcel(
      null,
      params.value.province.name,
      useUtils.getDateFormatDDMMYYYYDash(params.value.startDate),
      useUtils.getDateFormatDDMMYYYYDash(params.value.endDate),
      params,
      loadingXLS
    );
  }
};

const filterDrugStoreSection = ref(null);
const closeSection = () => {
  filterDrugStoreSection.value.remove();
};

provide('loadingPDF', loadingPDF);
provide('loadingXLS', loadingXLS);
</script>

<style lang="scss" scoped>
.param-container {
  border-bottom: 1px dashed $grey-13;
  border-left: 1px dashed $grey-13;
  border-right: 1px dashed $grey-13;
  border-radius: 0px 0px 5px 5px;
}
</style>
