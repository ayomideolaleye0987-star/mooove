import React from 'react'
import { FileText } from 'lucide-react'

export default function SubmitForm({ newCase, setNewCase, onSubmit, onCancel }) {
  return (
    <div className="bg-black border-4 border-red-600 rounded-xl p-8 mb-8 shadow-2xl">
      <h3 className="text-3xl font-black text-white mb-6 flex items-center gap-3"><FileText className="w-8 h-8 text-red-600" />CRIME REPORT FORM</h3>

      <div className="space-y-6">
        <div>
          <label className="text-white font-bold mb-2 block">CRIME TITLE *</label>
          <input value={newCase.title} onChange={e => setNewCase({...newCase, title: e.target.value})} className="w-full bg-white border-4 border-gray-300 rounded-lg px-6 py-4 font-bold text-black focus:outline-none focus:border-red-600 text-lg" placeholder="e.g., Rug Pull on Token XYZ" />
        </div>

        <div>
          <label className="text-white font-bold mb-2 block">ACCUSED (X USERNAME) *</label>
          <input value={newCase.accused} onChange={e => setNewCase({...newCase, accused: e.target.value})} className="w-full bg-white border-4 border-gray-300 rounded-lg px-6 py-4 font-bold text-black focus:outline-none focus:border-red-600 text-lg" placeholder="@username" />
        </div>

        <div>
          <label className="text-white font-bold mb-2 block">CRIME DESCRIPTION *</label>
          <textarea value={newCase.description} onChange={e => setNewCase({...newCase, description: e.target.value})} rows="6" className="w-full bg-white border-4 border-gray-300 rounded-lg px-6 py-4 font-bold text-black focus:outline-none focus:border-red-600 text-lg" placeholder="Provide detailed description of the crime..." />
        </div>

        <div>
          <label className="text-white font-bold mb-2 block">EVIDENCE (Transaction Link or Twitter status link)</label>
          <input value={newCase.evidence} onChange={e => setNewCase({...newCase, evidence: e.target.value})} className="w-full bg-white border-4 border-gray-300 rounded-lg px-6 py-4 font-bold text-black focus:outline-none focus:border-red-600 text-lg" placeholder="Paste Snowtrace tx or Twitter status link..." />
        </div>

        <div className="flex items-center gap-4">
          <label className="text-white font-bold">
            <input type="checkbox" checked={!!newCase.anonymous} onChange={e => setNewCase({...newCase, anonymous: e.target.checked})} className="mr-2" /> Submit Anonymously
          </label>
        </div>

        <div className="flex gap-4">
          <button onClick={onSubmit} className="flex-1 bg-red-600 text-white py-5 rounded-lg font-black text-xl hover:bg-red-700 transition shadow-lg border-4 border-black">SUBMIT REPORT</button>
          <button onClick={onCancel} className="px-8 bg-gray-700 text-white py-5 rounded-lg font-black text-xl hover:bg-gray-800 transition border-4 border-black">CANCEL</button>
        </div>
      </div>
    </div>
  )
}
