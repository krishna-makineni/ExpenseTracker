import { useState } from 'react'
import { toast } from 'react-toastify'
import PageHeader from '../components/PageHeader.jsx'
import TransactionModal from '../components/TransactionModal.jsx'
import TransactionsTable from '../components/TransactionsTable.jsx'
import { useFinance } from '../context/FinanceContext.jsx'

export default function Transactions() {
  const { transactions, addTransaction, updateTransaction, deleteTransaction } = useFinance()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState(null)

  const handleAddClick = () => {
    setEditingTransaction(null)
    setIsModalOpen(true)
  }

  const handleEdit = (transaction) => {
    setEditingTransaction(transaction)
    setIsModalOpen(true)
  }

  const handleSubmit = async (transaction) => {
    try {
      if (transaction.id) {
        await updateTransaction(transaction)
        toast.success('Transaction updated successfully!', {
          icon: '✓',
        })
      } else {
        await addTransaction(transaction)
        toast.success('Transaction added successfully!', {
          icon: '✓',
        })
      }
      setIsModalOpen(false)
    } catch (error) {
      console.error('Failed to save transaction:', error)
      if (error.code === 'ERR_NETWORK' || error.code === 'ECONNREFUSED') {
        toast.error('Cannot connect to server. Please start JSON-Server.', {
          icon: '⚠️',
        })
      } else {
        toast.error('Failed to save transaction. Please try again.', {
          icon: '✕',
        })
      }
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Transactions"
        description="Maintain a detailed ledger of every income and expense."
        action={
          <button
            type="button"
            onClick={handleAddClick}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primary/90"
          >
            + Add Transaction
          </button>
        }
      />

      <TransactionsTable transactions={transactions} onEdit={handleEdit} onDelete={deleteTransaction} />

      <TransactionModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        initialData={editingTransaction}
      />
    </div>
  )
}

