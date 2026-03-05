import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, Upload, Activity, FileText, Download, Info, LayoutGrid } from 'lucide-react';
import { useLanguage } from '../LanguageContext';
import { analyzeMedicalImage } from '../services/geminiService';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function MedicalAI({ onClose }: { onClose: () => void }) {
  const { t, language } = useLanguage();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<{ normal: string; medical: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'analysis' | 'research'>('analysis');

  const datasets = [
    { name: "NIH Chest X-ray14", desc: "112,120 frontal-view X-ray images from 30,805 unique patients." },
    { name: "RSNA Pneumonia Detection", desc: "Challenge dataset for identifying pneumonia in chest X-rays." },
    { name: "LIDC-IDRI", desc: "Lung Image Database Consortium for lung nodule detection." },
    { name: "MosMedData", desc: "CT scans of patients with COVID-19 related pneumonia." },
    { name: "COVID-CTset", desc: "Large dataset of CT scans for COVID-19 diagnosis." },
    { name: "CheXpert", desc: "Large dataset of chest X-rays with expert labels." },
    { name: "MIMIC-CXR", desc: "De-identified chest X-ray dataset with radiology reports." },
    { name: "PadChest", desc: "Large-scale chest X-ray dataset with multi-label annotations." },
    { name: "VinDr-CXR", desc: "Open dataset of chest X-rays with radiologist annotations." },
    { name: "LUNA16", desc: "Lung Nodule Analysis challenge dataset." },
    { name: "DeepLesion", desc: "Large-scale dataset of diverse medical lesions." },
    { name: "ADNI", desc: "Alzheimer's Disease Neuroimaging Initiative dataset." },
    { name: "BraTS", desc: "Brain Tumor Segmentation challenge dataset." },
    { name: "ISIC Archive", desc: "Large collection of skin lesion images." },
    { name: "Kaggle Diabetic Retinopathy", desc: "Detection of diabetic retinopathy in retinal images." },
    { name: "H&E Stained Histology", desc: "Dataset for cancer detection in histology slides." },
    { name: "MURA", desc: "Large dataset of musculoskeletal X-rays." },
    { name: "EchoNet-Dynamic", desc: "Echocardiogram videos for cardiac function assessment." },
    { name: "OASIS", desc: "Open Access Series of Imaging Studies for brain research." },
    { name: "TCIA", desc: "The Cancer Imaging Archive - multiple cancer datasets." },
    { name: "FastMRI", desc: "Large dataset of raw MRI data for reconstruction research." },
    { name: "CAMELYON16/17", desc: "Cancer metastasis detection in lymph node slides." },
    { name: "KiTS19", desc: "Kidney Tumor Segmentation challenge dataset." },
    { name: "LiTS", desc: "Liver Tumor Segmentation challenge dataset." },
    { name: "ACDC", desc: "Automated Cardiac Diagnosis Challenge dataset." },
    { name: "PROMISE12", desc: "Prostate MR Image Segmentation dataset." },
    { name: "CHAOS", desc: "Combined Healthy Abdominal Organ Segmentation." },
    { name: "MSD", desc: "Medical Segmentation Decathlon - 10 different tasks." },
    { name: "VerSe", desc: "Large-scale vertebrae segmentation dataset." },
    { name: "TotalSegmentator", desc: "Dataset for segmenting 117 anatomical structures." }
  ];

  const pythonCode = `import torch
import monai
from monai.networks.nets import DenseNet121
from monai.transforms import Compose, Resize, ToTensor
import cv2

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

model = DenseNet121(
    spatial_dims=2,
    in_channels=1,
    out_channels=2
).to(device)

model.load_state_dict(torch.load("lung_model.pth"))
model.eval()

transform = Compose([
    Resize((224,224)),
    ToTensor()
])

def predict_ct(image_path):
    img = cv2.imread(image_path,0)
    img = transform(img).unsqueeze(0).to(device)
    with torch.no_grad():
        output = model(img)
    prob = torch.softmax(output,dim=1)
    pneumonia = prob[0][1].item()
    if pneumonia > 0.5:
        return {"result":"폐렴 의심", "confidence":pneumonia}
    else:
        return {"result":"정상 가능성 높음", "confidence":1-pneumonia}`;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(selected);
    }
  };

  const handleAnalyze = async () => {
    if (!preview) return;
    setIsLoading(true);
    const base64 = preview.split(',')[1];
    const mimeType = file?.type || 'image/jpeg';
    const analysis = await analyzeMedicalImage(base64, mimeType, language);
    setResult(analysis);
    setIsLoading(false);
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        className="relative w-full max-w-4xl bg-white rounded-[2rem] p-8 shadow-2xl max-h-[90vh] overflow-hidden flex flex-col"
      >
        <button onClick={onClose} className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 z-10">
          <X size={24} />
        </button>
        
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600">
            <Activity size={28} />
          </div>
          <div>
            <h2 className="text-2xl font-bold">{t('medicalTitle')}</h2>
            <p className="text-sm text-gray-500">{t('medicalDisclaimer')}</p>
          </div>
        </div>

        <div className="flex gap-2 mb-6 bg-gray-100 p-1 rounded-xl w-fit">
          <button 
            onClick={() => setActiveTab('analysis')}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-bold transition-all",
              activeTab === 'analysis' ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
            )}
          >
            {t('aiAnalysis')}
          </button>
          <button 
            onClick={() => setActiveTab('research')}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-bold transition-all",
              activeTab === 'research' ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
            )}
          >
            {t('researchData')}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
          {activeTab === 'analysis' ? (
            <div className="space-y-6">
              <div 
                className="border-2 border-dashed border-gray-200 rounded-3xl p-8 text-center hover:border-blue-400 transition-colors cursor-pointer relative overflow-hidden group"
                onClick={() => document.getElementById('medical-upload')?.click()}
              >
                {preview ? (
                  <img src={preview} alt="Preview" className="max-h-64 mx-auto rounded-xl" />
                ) : (
                  <div className="py-8">
                    <Upload size={48} className="mx-auto text-gray-300 mb-4 group-hover:text-blue-400 transition-colors" />
                    <p className="text-gray-500 font-medium">{t('medicalDesc')}</p>
                  </div>
                )}
                <input 
                  id="medical-upload"
                  type="file" 
                  className="hidden" 
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </div>

              <button 
                onClick={handleAnalyze}
                disabled={!file || isLoading}
                className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Activity size={20} />
                )}
                {t('analyze')}
              </button>

              {result && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6 bg-gray-50 p-6 rounded-3xl border border-gray-100"
                >
                  <div>
                    <h3 className="flex items-center gap-2 text-sm font-bold text-gray-900 mb-2">
                      <Info size={16} className="text-blue-500" />
                      {t('normalExplanation')}
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">{result.normal}</p>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-200">
                    <h3 className="flex items-center gap-2 text-sm font-bold text-gray-900 mb-2">
                      <FileText size={16} className="text-blue-500" />
                      {t('medicalExplanation')}
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed font-mono">{result.medical}</p>
                  </div>

                  <button 
                    onClick={() => window.print()}
                    className="w-full py-3 bg-white border border-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
                  >
                    <Download size={18} />
                    {t('downloadReport')}
                  </button>
                </motion.div>
              )}
            </div>
          ) : (
            <div className="space-y-8 pb-8">
              <div className="bg-amber-50 p-4 rounded-2xl border border-amber-100 text-amber-800 text-sm">
                <p className="font-bold mb-1">{t('researchNotice')}</p>
                <p>{t('researchDesc')}</p>
              </div>

              <div>
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <LayoutGrid size={20} className="text-blue-600" />
                  {t('datasetTitle')}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {datasets.map((ds, idx) => (
                    <div key={idx} className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                      <p className="font-bold text-blue-700 text-xs mb-1">{ds.name}</p>
                      <p className="text-[10px] text-gray-500">{ds.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <FileText size={20} className="text-blue-600" />
                  {t('codeTitle')}
                </h3>
                <div className="bg-gray-900 rounded-xl p-4 overflow-x-auto">
                  <pre className="text-[10px] text-gray-300 font-mono leading-relaxed">
                    <code>{pythonCode}</code>
                  </pre>
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
