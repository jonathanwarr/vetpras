'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function SubmitFormPage() {
  const [clinics, setClinics] = useState([])
  const [services, setServices] = useState([])
  const [clinicId, setClinicId] = useState('')
  const [serviceId, setServiceId] = useState('')
  const [price, setPrice] = useState('')
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      const { data: clinicData } = await supabase
        .from('clinics')
        .select('clinic_id, name')
      const { data: serviceData } = await supabase
        .from('services')
        .select('id, name')
      setClinics(clinicData || [])
      setServices(serviceData || [])
    }
    fetchData()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSuccess(false)
    setError(null)

    const { error } = await supabase.from('submissions').insert([
      {
        clinic_id: clinicId,
        service_id: serviceId,
        price: parseFloat(price),
        approved: false,
        submitted_at: new Date().toISOString(),
      },
    ])

    if (error) {
      setError(error.message)
    } else {
      setSuccess(true)
      setClinicId('')
      setServiceId('')
      setPrice('')
    }
  }

  return (
    <div className="mx-auto max-w-xl p-6">
      <h1 className="text-h2 font-playfair text-heading-1 mb-4 font-semibold">
        Submit a Vet Bill
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="text-body-md text-heading-2 mb-1 block font-medium">
            Clinic
          </label>
          <select
            value={clinicId}
            onChange={(e) => setClinicId(e.target.value)}
            className="text-body-md w-full rounded border border-gray-300 px-3 py-2"
            required
          >
            <option value="">Select a clinic</option>
            {clinics.map((clinic) => (
              <option key={clinic.clinic_id} value={clinic.clinic_id}>
                {clinic.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-body-md text-heading-2 mb-1 block font-medium">
            Service
          </label>
          <select
            value={serviceId}
            onChange={(e) => setServiceId(e.target.value)}
            className="text-body-md w-full rounded border border-gray-300 px-3 py-2"
            required
          >
            <option value="">Select a service</option>
            {services.map((service) => (
              <option key={service.id} value={service.id}>
                {service.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-body-md text-heading-2 mb-1 block font-medium">
            Price (CAD)
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="text-body-md w-full rounded border border-gray-300 px-3 py-2"
            placeholder="Enter price"
            required
          />
        </div>

        <button
          type="submit"
          className="bg-button-primary-bg text-button-primary-text text-btn-md hover:bg-button-primary-bg/90 rounded px-6 py-2 font-bold transition"
        >
          Submit
        </button>

        {success && (
          <p className="mt-2 text-sm text-green-600">Submission successful!</p>
        )}
        {error && <p className="mt-2 text-sm text-red-600">Error: {error}</p>}
      </form>
    </div>
  )
}
