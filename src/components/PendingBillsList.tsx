import React, { useState } from 'react';
import { DollarSign, Check, Edit3, Loader2 } from 'lucide-react';
import { usePendingBills } from '../hooks/usePendingBills';
import { Treatment } from '../types';

const PendingBillsList: React.FC = () => {
  const { bills, loading, updateBill } = usePendingBills();
  const [editingBill, setEditingBill] = useState<string | null>(null);
  const [boletaCodigo, setBoletaCodigo] = useState('');

  const handleEdit = (bill: Treatment) => {
    setEditingBill(bill.id);
    setBoletaCodigo(bill.boletaCodigo || '');
  };

  const handleSave = async (billId: string) => {
    if (boletaCodigo.trim()) {
      await updateBill(billId, boletaCodigo);
      setEditingBill(null);
      setBoletaCodigo('');
    }
  };

  const handleCancel = () => {
    setEditingBill(null);
    setBoletaCodigo('');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
      </div>
    );
  }

  if (bills.length === 0) {
    return (
      <div className="text-center py-8">
        <DollarSign className="w-12 h-12 text-gray-400 mx-auto mb-3" />
        <p className="text-gray-600">No hay boletas pendientes</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {bills.map((bill) => (
        <div 
          key={bill.id}
          className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                  <DollarSign className="w-4 h-4 text-yellow-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">
                    {bill.nombreCompleto || 'N/A'}
                  </h4>
                  <p className="text-sm text-gray-600">
                    HC: {bill.numeroHistoria || 'N/A'} - {bill.tipo}
                  </p>
                  <p className="text-xs text-gray-500">
                    Pieza: {bill.piezaDental || 'N/A'}
                  </p>
                </div>
              </div>
              
              {bill.costo && (
                <div className="mt-2 text-sm text-gray-600">
                  Costo: S/ {bill.costo.toFixed(2)}
                </div>
              )}
            </div>

            <div className="flex items-center space-x-2">
              {editingBill === bill.id ? (
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={boletaCodigo}
                    onChange={(e) => setBoletaCodigo(e.target.value)}
                    placeholder="Código de boleta"
                    className="px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={() => handleSave(bill.id)}
                    className="p-1 text-green-600 hover:bg-green-50 rounded"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleCancel}
                    className="p-1 text-gray-600 hover:bg-gray-50 rounded"
                  >
                    ×
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => handleEdit(bill)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PendingBillsList;