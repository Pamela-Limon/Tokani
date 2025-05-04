'use client';

import { CONTRACT_ADDRESS, ABI } from '@/lib/contract';
import { useState } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useWriteContract } from 'wagmi';
import { NFTStorage, File } from 'nft.storage';
import { uploadToPinata, uploadMetadataToPinata } from '@/lib/pinata';
import { motion } from 'framer-motion';

export default function Home() {
  const { address } = useAccount();
  const { writeContractAsync } = useWriteContract();
  const [txHash, setTxHash] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [description, setDescription] = useState('');
  const [commercialUse, setCommercialUse] = useState(false);
  const [derivatives, setDerivatives] = useState(false);
  const [location, setLocation] = useState('');
  const [custodialCommunity, setCustodialCommunity] = useState('');
  const [distribucion, setDistribucion] = useState('');
  const [species, setSpecies] = useState('');
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file || !address) return alert('Fill all fields');
  
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
        { trait_type: 'Location', value: location },
        { trait_type: 'Custodial Community', value: custodialCommunity },
        { trait_type: 'Distribución', value: distribucion },
        { trait_type: 'Species', value: species }
      ]
    };
  
    const tokenURI = await uploadMetadataToPinata(metadata);
  
    // Calculate expiry timestamp (1 year from now)
    const expiryTimestamp = BigInt(Math.floor(Date.now() / 1000) + 365 * 24 * 60 * 60);
  
    try {
      const tx = await writeContractAsync({
        abi: ABI,
        address: CONTRACT_ADDRESS as `0x${string}`,
        functionName: 'registerIP',
        args: [
          address, // to
          tokenURI, // uri
          commercialUse, // commercialUse
          derivatives, // derivativeWorksAllowed
          expiryTimestamp, // expiryTimestamp
          location, // location
          custodialCommunity, // custodialCommunity
          distribucion // distribucion
        ]
      });

      setTxHash(tx);
      alert('✅ IP Registered via Pinata!');
      setSubmitted(true);
    } catch (error) {
      console.error('Error registering IP:', error);
      alert('Error registering IP. Please check the console for details.');
    }
  }


  return (
    <div className="min-h-screen bg-gradient-to-br from-[#96bd5a]/10 via-[#96bd5a]/20 to-[#96bd5a]/30 px-4 py-10">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl mx-auto bg-white/90 rounded-2xl shadow-xl p-8 space-y-6 backdrop-blur-lg border border-[#96bd5a]/20"
      >
        <div className="flex items-center justify-between">
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl font-bold text-[#96bd5a]"
          >
            🌱 Register Your IP
          </motion.h1>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <ConnectButton />
          </motion.div>
        </div>

        <motion.form 
          onSubmit={handleSubmit} 
          className="space-y-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <motion.div
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <label className="block text-sm font-medium text-[#96bd5a] mb-1">Upload Genetic Sequence</label>
            <input
              type="file"
              onChange={e => setFile(e.target.files?.[0] || null)}
              className="w-full text-sm text-[#96bd5a] border-2 border-[#96bd5a]/30 rounded-lg px-4 py-2 file:text-[#96bd5a] file:mr-4 file:rounded-md file:border-0 file:bg-[#96bd5a]/10 file:px-4 file:py-2 hover:border-[#96bd5a]/50 transition-colors"
            />
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <label className="block text-sm font-medium text-[#96bd5a] mb-1">Description</label>
            <input
              type="text"
              placeholder="e.g. Digital artwork, melody, design..."
              className="w-full border-2 border-[#96bd5a]/30 rounded-lg px-4 py-2 placeholder-[#96bd5a]/50 text-[#96bd5a] focus:border-[#96bd5a] focus:ring-2 focus:ring-[#96bd5a]/20 transition-all"
              value={description}
              onChange={e => setDescription(e.target.value)}
            />
          </motion.div>

          <motion.div 
            className="flex flex-col gap-4 p-4 bg-[#96bd5a]/5 rounded-lg border border-[#96bd5a]/20"
            whileHover={{ scale: 1.01 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <label className="inline-flex items-center text-[#96bd5a] font-medium cursor-pointer">
              <input
                type="checkbox"
                checked={commercialUse}
                onChange={() => setCommercialUse(!commercialUse)}
                className="mr-2 h-5 w-5 rounded border-[#96bd5a] text-[#96bd5a] transition-all duration-150 ease-in-out focus:ring-2 focus:ring-[#96bd5a]/20"
              />
              Allow Commercial Use
            </label>

            <label className="inline-flex items-center text-[#96bd5a] font-medium cursor-pointer">
              <input
                type="checkbox"
                checked={derivatives}
                onChange={() => setDerivatives(!derivatives)}
                className="mr-2 h-5 w-5 rounded border-[#96bd5a] text-[#96bd5a] transition-all duration-150 ease-in-out focus:ring-2 focus:ring-[#96bd5a]/20"
              />
              Allow Derivative Works
            </label>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <label className="block text-sm font-medium text-[#96bd5a] mb-1">Custodial Community</label>
            <input
              type="text"
              placeholder="e.g. Indigenous group, Local community..."
              className="w-full border-2 border-[#96bd5a]/30 rounded-lg px-4 py-2 placeholder-[#96bd5a]/50 text-[#96bd5a] focus:border-[#96bd5a] focus:ring-2 focus:ring-[#96bd5a]/20 transition-all"
              value={custodialCommunity}
              onChange={e => setCustodialCommunity(e.target.value)}
            />
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <label className="block text-sm font-medium text-[#96bd5a] mb-1">Distribución</label>
            <input
              type="text"
              placeholder="e.g. Región, País, Continente..."
              className="w-full border-2 border-[#96bd5a]/30 rounded-lg px-4 py-2 placeholder-[#96bd5a]/50 text-[#96bd5a] focus:border-[#96bd5a] focus:ring-2 focus:ring-[#96bd5a]/20 transition-all"
              value={distribucion}
              onChange={e => setDistribucion(e.target.value)}
            />
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <label className="block text-sm font-medium text-[#96bd5a] mb-1">Species</label>
            <input
              type="text"
              placeholder="e.g. Zea mays, Phaseolus vulgaris, Oryza sativa..."
              className="w-full border-2 border-[#96bd5a]/30 rounded-lg px-4 py-2 placeholder-[#96bd5a]/50 text-[#96bd5a] focus:border-[#96bd5a] focus:ring-2 focus:ring-[#96bd5a]/20 transition-all"
              value={species}
              onChange={e => setSpecies(e.target.value)}
            />
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <label className="block text-sm font-medium text-[#96bd5a] mb-1">Location</label>
            <input
              type="text"
              placeholder="e.g. Country, Region, Coordinates..."
              className="w-full border-2 border-[#96bd5a]/30 rounded-lg px-4 py-2 placeholder-[#96bd5a]/50 text-[#96bd5a] focus:border-[#96bd5a] focus:ring-2 focus:ring-[#96bd5a]/20 transition-all"
              value={location}
              onChange={e => setLocation(e.target.value)}
            />
          </motion.div>

          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-[#96bd5a] text-white font-semibold py-3 px-4 rounded-lg hover:bg-[#96bd5a]/90 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
          >
            <span>🌱</span> Register IP
          </motion.button>
        </motion.form>

        {txHash && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 p-4 bg-[#96bd5a]/5 rounded-lg border border-[#96bd5a]/20"
          >
            <p className="text-sm text-[#96bd5a]">
              🌱 Transaction submitted: <br />
              <a
                href={`https://basecamp.cloud.blockscout.com/tx/${txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="underline break-all hover:text-[#96bd5a]/80 transition-colors"
              >
                {txHash}
              </a>
            </p>
          </motion.div>
        )}

        {submitted && file && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 border-t border-[#96bd5a]/20 pt-6"
          >
            <h2 className="text-lg font-semibold mb-4 text-[#96bd5a]">Submission Summary</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3 bg-[#96bd5a]/5 rounded-lg border border-[#96bd5a]/20">
                <p className="text-sm text-[#96bd5a]/70">File</p>
                <p className="font-medium text-[#96bd5a]">{file.name}</p>
              </div>
              <div className="p-3 bg-[#96bd5a]/5 rounded-lg border border-[#96bd5a]/20">
                <p className="text-sm text-[#96bd5a]/70">Description</p>
                <p className="font-medium text-[#96bd5a]">{description}</p>
              </div>
              <div className="p-3 bg-[#96bd5a]/5 rounded-lg border border-[#96bd5a]/20">
                <p className="text-sm text-[#96bd5a]/70">Commercial Use</p>
                <p className="font-medium text-[#96bd5a]">{commercialUse ? 'Allowed' : 'Not allowed'}</p>
              </div>
              <div className="p-3 bg-[#96bd5a]/5 rounded-lg border border-[#96bd5a]/20">
                <p className="text-sm text-[#96bd5a]/70">Derivatives</p>
                <p className="font-medium text-[#96bd5a]">{derivatives ? 'Allowed' : 'Not allowed'}</p>
              </div>
              <div className="p-3 bg-[#96bd5a]/5 rounded-lg border border-[#96bd5a]/20">
                <p className="text-sm text-[#96bd5a]/70">Location</p>
                <p className="font-medium text-[#96bd5a]">{location || 'Not specified'}</p>
              </div>
              <div className="p-3 bg-[#96bd5a]/5 rounded-lg border border-[#96bd5a]/20">
                <p className="text-sm text-[#96bd5a]/70">Custodial Community</p>
                <p className="font-medium text-[#96bd5a]">{custodialCommunity || 'Not specified'}</p>
              </div>
              <div className="p-3 bg-[#96bd5a]/5 rounded-lg border border-[#96bd5a]/20">
                <p className="text-sm text-[#96bd5a]/70">Distribución</p>
                <p className="font-medium text-[#96bd5a]">{distribucion || 'Not specified'}</p>
              </div>
              <div className="p-3 bg-[#96bd5a]/5 rounded-lg border border-[#96bd5a]/20">
                <p className="text-sm text-[#96bd5a]/70">Species</p>
                <p className="font-medium text-[#96bd5a]">{species || 'Not specified'}</p>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
