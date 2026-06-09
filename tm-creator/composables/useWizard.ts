import { useWizardStore } from '~/stores/wizard'
import { useSegmentsStore } from '~/stores/segments'

export function useWizard() {
  const wizard = useWizardStore()
  const segments = useSegmentsStore()

  async function proceedToStep2() {
    await wizard.uploadAndAdvance()
  }

  async function proceedToStep3() {
    wizard.setStep(3)
    await segments.loadSegments()
  }

  function goBack() {
    if (wizard.step === 3) wizard.setStep(2)
    else if (wizard.step === 2) wizard.setStep(1)
  }

  return { wizard, segments, proceedToStep2, proceedToStep3, goBack }
}
