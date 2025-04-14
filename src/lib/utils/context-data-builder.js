// src/lib/utils/context-data-builder.js

/**
 * Builds context_data payload for Supabase based on category and form fields.
 * @param {string} category - Feedback category selected by the user.
 * @param {object} formData - Raw form input values.
 * @param {string} [imageUrl] - Optional image URL returned from upload.
 * @returns {object} Structured context_data payload.
 */
export function buildContextData(category, formData, imageUrl) {
  switch (category) {
    case 'add_service_to_clinic':
      return {
        clinic_id: formData.clinic_id,
        service_code: formData.service_code,
        image_url: imageUrl || null,
      };

    case 'add_service_to_vetpras':
      return {
        service_name: formData.service_name,
        image_url: imageUrl || null,
      };

    case 'add_clinic':
      return {
        clinic_name: formData.clinic_name,
        website: formData.website || null,
      };

    case 'update_clinic_details':
      return {
        clinic_id: formData.clinic_id,
        fields: {
          phone: formData.phone || null,
          website: formData.website || null,
          address: formData.address || null,
        },
      };

    case 'site_feedback':
      return {
        type: formData.feedback_type,
        description: formData.description || null,
        image_url: imageUrl || null,
      };

    default:
      return { message: 'Unsupported feedback category' };
  }
}
