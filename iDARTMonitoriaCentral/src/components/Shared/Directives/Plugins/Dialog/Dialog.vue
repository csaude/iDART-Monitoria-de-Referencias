<template>
  <div>
    <q-card style="width: 500px">
      <q-card-section>
        <div class="row">
          <q-icon :name="iconName" size="md" :color="color"></q-icon>
          <div class="text-h6 q-ml-sm" :class="titleColor">
            <slot name="title"></slot>
          </div>
        </div>
      </q-card-section>

      <q-card-section class="q-pt-none q-mt-md q-ml-sm">
        <slot name="msg"></slot>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn
          flat
          label="Cancelar"
          v-if="isConfirmationDialog"
          color="primary"
          v-close-popup
          class="q-mr-sm"
          @click="$emit('cancelOperation')"
        />

        <q-btn
          flat
          label="Continuar"
          v-if="isConfirmationDialog"
          color="primary"
          v-close-popup
          class="q-mr-sm"
          @click="$emit('commitOperation')"
        />

        <q-btn
          flat
          label="OK"
          v-if="!isConfirmationDialog"
          color="primary"
          v-close-popup
          class="q-mr-sm"
          @click="$emit('closeDialog')"
        />
      </q-card-actions>
    </q-card>
  </div>
</template>

<script setup>
import { computed } from 'vue';

/*
  Declaration
*/

/*
  Props
*/
const props = defineProps({
  type: {
    type: String,
    default: '',
  },
});
/*
  Computed Methods
*/
const iconName = computed(() => {
  if (props.type === 'error') return 'report';
  if (props.type === 'warning' || props.type === 'confirmation')
    return 'warning';
  return 'info';
});

const color = computed(() => {
  if (props.type === 'error') return 'red';
  if (props.type === 'warning' || props.type === 'confirmation')
    return 'warning';
  return 'primary';
});
const titleColor = computed(() => {
  if (props.type === 'error') return 'text-red';
  if (props.type === 'warning' || props.type === 'confirmation')
    return 'text-warning';
  return 'text-primary';
});
const isConfirmationDialog = computed(() => {
  return props.type === 'confirmation';
});
</script>
