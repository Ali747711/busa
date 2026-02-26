/**
 * Google Forms Helper - Pre-fill forms with session/event context
 * 
 * Usage:
 * 1. Create your Google Form and get the form ID from the URL
 * 2. For each field you want to pre-fill, inspect the form and get the entry ID
 * 3. Use generateGoogleFormUrl() to create pre-filled URLs
 */

// Example Google Form configuration
// Replace these with your actual form ID and entry IDs
const GOOGLE_FORM_CONFIG = {
  // Main registration form
  registration: {
    formId: 'YOUR_FORM_ID_HERE', // e.g., '1FAIpQLSe...'
    fields: {
      sessionTitle: 'entry.123456789',    // Session/Event title
      sessionDate: 'entry.987654321',     // Session date
      sessionType: 'entry.456789123',     // Online/Offline
      firstName: 'entry.789123456',       // First name
      lastName: 'entry.321654987',        // Last name
      email: 'entry.654987321',           // Email
      university: 'entry.147258369',      // University
      englishLevel: 'entry.963852741'     // English level
    }
  }
}

/**
 * Generate a pre-filled Google Form URL with session/event context
 * @param {string} formType - Type of form ('registration')
 * @param {object} sessionData - Session or event data
 * @param {object} prefillData - Additional data to pre-fill (optional)
 * @returns {string} - Pre-filled Google Form URL
 */
export const generateGoogleFormUrl = (formType = 'registration', sessionData = {}, prefillData = {}) => {
  const config = GOOGLE_FORM_CONFIG[formType]
  
  if (!config || !config.formId) {
    console.warn(`Google Form configuration not found for type: ${formType}`)
    return `https://forms.google.com/`
  }

  const baseUrl = `https://docs.google.com/forms/d/${config.formId}/viewform`
  const params = new URLSearchParams()

  // Pre-fill session/event context
  if (sessionData.title && config.fields.sessionTitle) {
    params.append(config.fields.sessionTitle, sessionData.title)
  }
  
  if (sessionData.date && config.fields.sessionDate) {
    params.append(config.fields.sessionDate, sessionData.date.toLocaleDateString())
  }
  
  if (sessionData.type && config.fields.sessionType) {
    const sessionType = sessionData.type === 'zoom' ? 'Online (Zoom)' : 'Offline'
    params.append(config.fields.sessionType, sessionType)
  }

  // Pre-fill additional data if provided
  Object.entries(prefillData).forEach(([key, value]) => {
    if (config.fields[key] && value) {
      params.append(config.fields[key], value)
    }
  })

  return `${baseUrl}?${params.toString()}`
}

/**
 * Open Google Form in a new tab/window
 * @param {string} formType - Type of form
 * @param {object} sessionData - Session or event data
 * @param {object} prefillData - Additional data to pre-fill
 */
export const openGoogleForm = (formType, sessionData, prefillData = {}) => {
  const url = generateGoogleFormUrl(formType, sessionData, prefillData)
  window.open(url, '_blank', 'noopener,noreferrer')
}

/**
 * Update Google Form configuration
 * @param {string} formType - Type of form
 * @param {object} newConfig - New configuration
 */
export const updateFormConfig = (formType, newConfig) => {
  if (GOOGLE_FORM_CONFIG[formType]) {
    GOOGLE_FORM_CONFIG[formType] = { ...GOOGLE_FORM_CONFIG[formType], ...newConfig }
  } else {
    GOOGLE_FORM_CONFIG[formType] = newConfig
  }
}

/**
 * Get current form configuration
 * @param {string} formType - Type of form
 * @returns {object} - Form configuration
 */
export const getFormConfig = (formType) => {
  return GOOGLE_FORM_CONFIG[formType] || null
}

// Example usage:
// 
// 1. Basic usage with session data:
// const url = generateGoogleFormUrl('registration', {
//   title: 'Public Speaking Masterclass',
//   date: new Date('2024-12-15'),
//   type: 'zoom'
// })
//
// 2. With additional pre-filled data:
// openGoogleForm('registration', sessionData, {
//   firstName: 'John',
//   lastName: 'Doe',
//   email: 'john.doe@example.com'
// })
//
// 3. Update configuration:
// updateFormConfig('registration', {
//   formId: '1FAIpQLSe-new-form-id',
//   fields: { ... }
// })

export default {
  generateGoogleFormUrl,
  openGoogleForm,
  updateFormConfig,
  getFormConfig
} 