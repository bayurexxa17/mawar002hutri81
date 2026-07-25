import { useState } from 'react';
import type { BankAccount, EWallet } from '../data/banks';

interface BankCardProps {
  account: BankAccount | EWallet;
  type: 'bank' | 'ewallet';
}

export default function BankCard({ account, type }: BankCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const textToCopy = (account as any).number || (account as any).bank || '';
    navigator.clipboard.writeText(textToCopy.replace(/\s|-/g, ''));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isBank = type === 'bank';
  const bankAccount = account as BankAccount;
  const ewallet = account as EWallet;

  return (
    <div className="relative group bg-white rounded-2xl border-2 border-gray-100 p-5 hover:border-red-200 hover:shadow-xl transition-all duration-300 overflow-hidden">
      {/* Background Gradient */}
      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${account.color} opacity-5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:opacity-10 transition-opacity`} />
      
      {isBank && (bankAccount as any).isPrimary && (
        <span className="absolute top-3 right-3 bg-[#C1272D] text-white text-[10px] px-2 py-1 rounded-full font-bold">★ UTAMA</span>
      )}

      <div className="relative flex items-start gap-4">
        {/* Icon */}
        <div className={`flex-shrink-0 w-14 h-14 bg-gradient-to-br ${account.color} rounded-xl flex items-center justify-center text-2xl shadow-lg`}>
          {account.icon}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="font-black text-gray-800">
              {isBank ? `${bankAccount.bank} - ${bankAccount.bankName}` : ewallet.name}
            </h4>
          </div>
          <div className="mt-2">
            <div className="text-xs text-gray-500 uppercase tracking-wider">No. {isBank ? 'Rekening' : 'E-Wallet'}</div>
            <div className="font-mono font-bold text-lg text-gray-800 tracking-wide mt-1">
              {account.number}
            </div>
          </div>
          <div className="mt-2">
            <div className="text-xs text-gray-500">Atas Nama:</div>
            <div className="text-sm font-semibold text-gray-700">{account.holder}</div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="relative mt-4 flex gap-2">
        <button
          onClick={handleCopy}
          className={`flex-1 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
            copied 
              ? 'bg-green-500 text-white' 
              : 'bg-gray-900 text-white hover:bg-black'
          }`}
        >
          {copied ? '✅ Tersalin!' : '📋 Salin No.'}
        </button>
        <a
          href={`https://wa.me/${(isBank ? '6281288395550' : (account as EWallet).number.replace(/[^0-9]/g,'').replace(/^0/,'62'))}?text=Halo%20Panitia%2C%20saya%20sudah%20transfer%20donasi%20HUT%20RI%2081%20ke%20${encodeURIComponent(isBank ? (account as BankAccount).bank : (account as EWallet).name)}%20a.n.%20${encodeURIComponent(account.holder)}%20sebesar%20Rp%20...%20Mohon%20dicek%20ya`}
          target="_blank"
          className="px-4 py-2.5 bg-[#25D366] text-white rounded-xl font-bold text-sm hover:bg-green-600 transition flex items-center gap-1"
        >
          <span>💬</span> Konfirmasi
        </a>
      </div>
    </div>
  );
}
