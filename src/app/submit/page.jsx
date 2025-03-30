"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase-client"

export default function SubmitFormPage() {
  const [clinics, setClinics] = useState([])
  const [services, setServices] = useState([])
  const [clinicId, setClinicId] = useState("")
  const [serviceId, setServiceId] = useState("")
  const [price, setPrice] = useState("")
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      const { data: clinicData } = await supabase.from("clinics").select("clinic_id, name")
      const { data: serviceData } = await supabase.from("services").select("id, name")
      setClinics(clinicData || [])
      setServices(serviceData || [])
    }
    fetchData()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSuccess(false)
    setError(null)

    const { error } = await supabase.from("submissions").insert([
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
      setClinicId("")
      setServiceId("")
      setPrice("")
    }
  }

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Submit a Vet Bill</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">Clinic</label>
          <select
            value={clinicId}
            onChange={(e) => setClinicId(e.target.value)}
            className="w-full border rounded p-2"
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
          <label className="block font-medium">Service</label>
          <select
            value={serviceId}
            onChange={(e) => setServiceId(e.target.value)}
            className="w-full border rounded p-2"
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
          <label className="block font-medium">Price (CAD)</label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full border rounded p-2"
            placeholder="Enter price"
            required
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Submit
        </button>

        {success && <p className="text-green-600">Submission successful!</p>}
        {error && <p className="text-red-600">Error: {error}</p>}
      </form>
    </div>
  )
}
