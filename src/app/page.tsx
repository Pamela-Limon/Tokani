'use client';

import { CONTRACT_ADDRESS, ABI } from '@/lib/contract';
import { useState } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useWriteContract } from 'wagmi';
import { NFTStorage, File } from 'nft.storage';
import { uploadToPinata, uploadMetadataToPinata } from '@/lib/pinata';

export default function Home() {
  const { address } = useAccount();
  const { writeContractAsync } = useWriteContract();
  const [txHash, setTxHash] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [description, setDescription] = useState('');
  const [commercialUse, setCommercialUse] = useState(false);
  const [derivatives, setDerivatives] = useState(false);
  const [expiry, setExpiry] = useState('');
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file || !address || !expiry) return alert('Fill all fields');
  
    // Upload image to IPFS via Pinata
    const imageURI = await uploadToPinata(file);
  
    // Build and upload metadata
    const metadata = {
      name: file.name,
      description,
      image: imageURI,
      attributes: [
        { trait_type: 'Commercial Use', value: commercialUse },
        { trait_type: 'Derivatives Allowed', value: derivatives },
        { trait_type: 'Expiry', value: expiry }
      ]
    };
  
    const tokenURI = await uploadMetadataToPinata(metadata);
    const expiryUnix = Math.floor(new Date(expiry).getTime() / 1000);
  
    const tx = await writeContractAsync({
      abi: ABI,
      address: CONTRACT_ADDRESS as `0x${string}`,
      functionName: 'registerIP',
      args: [address, tokenURI, commercialUse, derivatives, expiryUnix]
    });

    setTxHash(tx);
  
    alert('✅ IP Registered via Pinata!');
    setSubmitted(true);
  }


  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md p-8 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-800">Register Your IP</h1>
          <ConnectButton />
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Upload File</label>
            <input
              type="file"
              onChange={e => setFile(e.target.files?.[0] || null)}
              className="w-full text-sm text-gray-700 border border-gray-300 rounded-md px-4 py-2 file:text-gray-600 file:mr-4 file:rounded-md file:border-0 file:bg-gray-100 file:px-4 file:py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <input
              type="text"
              placeholder="e.g. Digital artwork, melody, design..."
              className="w-full border border-gray-300 rounded-md px-4 py-2 placeholder-gray-500 text-gray-800"
              value={description}
              onChange={e => setDescription(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="inline-flex items-center text-gray-800 font-medium">
              <input
                type="checkbox"
                checked={commercialUse}
                onChange={() => setCommercialUse(!commercialUse)}
                className="mr-2 h-4 w-4 rounded border-gray-300 text-black transition-all duration-150 ease-in-out focus:ring-2 focus:ring-black"
              />
              Allow Commercial Use
            </label>

            <label className="inline-flex items-center text-gray-800 font-medium">
              <input
                type="checkbox"
                checked={derivatives}
                onChange={() => setDerivatives(!derivatives)}
                className="mr-2 h-4 w-4 rounded border-gray-300 text-black transition-all duration-150 ease-in-out focus:ring-2 focus:ring-black"
              />
              Allow Derivative Works
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">License Expiry</label>
            <input
              type="date"
              placeholder="yyyy-mm-dd"
              className="w-full border border-gray-300 rounded-md px-4 py-2 placeholder-gray-500 text-gray-800"
              onChange={e => setExpiry(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-black text-white font-semibold py-3 px-4 rounded-md hover:bg-gray-900 transition"
          >
            🚀 Register IP
          </button>
        </form>
        {txHash && (
        <div className="mt-6 text-sm text-green-700">
          ✅ Transaction submitted: <br />
          <a
            href={`https://basecamp.cloud.blockscout.com/tx/${txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline break-all"
          >
            {txHash}
          </a>
        </div>
      )}

        {submitted && file && (
          <div className="mt-6 border-t pt-6">
            <h2 className="text-lg font-semibold mb-2 text-gray-800">Submission Summary</h2>
            <ul className="text-gray-700 space-y-1">
              <li><strong>File:</strong> {file.name}</li>
              <li><strong>Description:</strong> {description}</li>
              <li><strong>Commercial Use:</strong> {commercialUse ? 'Allowed' : 'Not allowed'}</li>
              <li><strong>Derivatives:</strong> {derivatives ? 'Allowed' : 'Not allowed'}</li>
              <li><strong>Expiry:</strong> {expiry || 'Not set'}</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
