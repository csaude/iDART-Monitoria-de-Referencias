<template>
  <q-layout view="hHh LpR fFf">
    <q-drawer show-if-above v-model="rightDrawerOpen" side="right" bordered>
      <PatientDetail />
    </q-drawer>
    <div class="row q-my-md">
      <q-btn color="warning" @click="goBack" icon="arrow_back" label="Voltar" />
    </div>
    <q-page-container>
      <div class="q-pa-md q-pt-xl">
        <q-splitter v-model="splitterModel">
          <template v-slot:before>
            <q-tabs
              v-model="selectedTab"
              vertical
              active-bg-color="white"
              active-color="primary"
              indicator-color="orange"
              class="text-grey"
            >
              <q-tab v-for="tab in tabs" :key="tab.name" v-bind="tab" />
            </q-tabs>
          </template>

          <template v-slot:after>
            <q-tab-panels
              v-model="selectedTab"
              animated
              swipeable
              vertical
              transition-prev="slide-down"
              transition-next="slide-up"
            >
              <q-tab-panel name="episodios">
                <episodes />
              </q-tab-panel>

              <q-tab-panel name="clinicInformation">
                <clinicInformations />
              </q-tab-panel>

              <q-tab-panel name="prescription">
                <prescriptions />
              </q-tab-panel>

              <q-tab-panel name="dispense">
                <dispenses />
              </q-tab-panel>

              <q-tab-panel name="clinicInformation">
                <div class="text-h4 q-mb-md"></div>
                <clinicInformations />
              </q-tab-panel>
            </q-tab-panels>
          </template>
        </q-splitter>
      </div>
    </q-page-container>
  </q-layout>
</template>
<script setup>
import { inject, ref } from 'vue';

import PatientDetail from './PatientDetail.vue';

import episodes from 'src/components/episode/Episode.vue';

import clinicInformations from 'src/pages/ClinicInformation/ClinicInformation.vue';
import prescriptions from 'src/pages/ClinicInformation/Prescription.vue';
import dispenses from 'src/pages/ClinicInformation/Dispense.vue';

const rightDrawerOpen = ref(false);

const selectedTab = ref('episodios');
const splitterModel = ref(15);
const tabs = [
  { name: 'episodios', icon: 'local_hospital', label: 'Episódios' },
  { name: 'dispense', icon: 'medication', label: 'Dispensas' },
  { name: 'prescription', icon: 'medication', label: 'Prescrições' },
  {
    name: 'clinicInformation',
    icon: 'local_pharmacy',
    label: 'Atenção Farmacêutica',
  },
];

const toggleRightDrawer = () => {
  rightDrawerOpen.value = !rightDrawerOpen.value;
};

const goBack = inject('goBack');
</script>

<style></style>
