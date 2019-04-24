import * as ONBOARDING from 'actions/constants/onboarding';

import { getLocalization } from './fetchActions';

const goToStep = stepId => (dispatch) => {
    dispatch(setStep(stepId));
};

const setStep = stepId => (dispatch) => {
    dispatch({
        type: ONBOARDING.SET_STEP_ACTIVE,
        stepId,
    });
};

const goToSubStep = subStepId => ({
    type: ONBOARDING.GO_TO_SUBSTEP,
    subStepId,
});

const goToNextStep = stepId => (dispatch, getState) => {
    const { activeStepId, steps } = getState().onboarding;
    const nextStep = findNextStep(activeStepId, steps);
    const activeStep = steps.find(step => step.id === activeStepId);

    if (!activeStep.resolved) {
        dispatch({
            type: ONBOARDING.SET_STEP_RESOLVED,
            stepId: activeStepId,
        });
    }

    dispatch(goToStep(stepId || nextStep.id));
};

const goToPreviousStep = () => (dispatch, getState) => {
    const { activeStepId } = getState().onboarding;
    const prevStep = findPrevStep(activeStepId, getState().onboarding.steps);

    dispatch(goToStep(prevStep.id));
};

const selectTrezorModel = model => ({
    type: ONBOARDING.SELECT_TREZOR_MODEL,
    model,
});

const findNextStep = (currentStep, onboardingSteps) => {
    const currentIndex = onboardingSteps.findIndex(step => step.id === currentStep);
    if (currentIndex + 1 > onboardingSteps.length) {
        throw new Error('no next step exists');
    }
    return onboardingSteps[currentIndex + 1];
};

const findPrevStep = (currentStep, onboardingSteps) => {
    const currentIndex = onboardingSteps.findIndex(step => step.id === currentStep);
    if (currentIndex - 1 > onboardingSteps.length) {
        throw new Error('no next step exists');
    }
    return onboardingSteps[currentIndex - 1];
};

const setApplicationError = error => ({
    type: ONBOARDING.SET_APPLICATION_ERROR,
    error,
});

const setLocale = locale => (dispatch) => {
    dispatch(getLocalization(`/${locale}.json`)).then(async (result) => {
        const json = await result.json();
        dispatch({
            type: ONBOARDING.SET_LOCALIZATION,
            language: locale,
            messages: json,
        });
    });
};

const toggleDownloadClicked = () => ({
    type: ONBOARDING.TOGGLE_DOWNLOAD_CLICKED,
});

const startAgain = () => () => {
    window.location.reload();
};

export {
    goToNextStep,
    goToSubStep,
    goToStep,
    setStep,
    goToPreviousStep,
    selectTrezorModel,
    setApplicationError,
    setLocale,
    toggleDownloadClicked,
    startAgain,
};
