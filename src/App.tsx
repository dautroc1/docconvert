import React, { useState } from 'react';
import { Upload, FileText, Image, Zap, Target, Shield, Download, Mail, Check, ArrowRight, FileSpreadsheet, Clock, Users } from 'lucide-react';

interface UploadState {
  file: File | null;
  uploading: boolean;
  result: string | null;
  error: string | null;
}

function App() {
  const [llmUpload, setLlmUpload] = useState<UploadState>({
    file: null,
    uploading: false,
    result: null,
    error: null
  });

  const [normalUpload, setNormalUpload] = useState<UploadState>({
    file: null,
    uploading: false,
    result: null,
    error: null
  });

  const [email, setEmail] = useState('');
  const [emailSubmitted, setEmailSubmitted] = useState(false);

  const handleFileUpload = async (file: File, type: 'llm' | 'normal') => {
    const setState = type === 'llm' ? setLlmUpload : setNormalUpload;
    
    setState(prev => ({ ...prev, file, uploading: true, error: null, result: null }));

    try {
      const formData = new FormData();
      formData.append('file', file);

      // Replace with your actual API endpoints
      const endpoint = type === 'llm' ? '/api/llm-convert' : '/api/normal-convert';
      
      const response = await fetch(endpoint, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Conversion failed');
      }

      const result = await response.text();
      setState(prev => ({ ...prev, uploading: false, result }));
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        uploading: false, 
        error: error instanceof Error ? error.message : 'Upload failed' 
      }));
    }
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Replace with your email collection API
    console.log('Email submitted:', email);
    setEmailSubmitted(true);
    setTimeout(() => setEmailSubmitted(false), 3000);
  };

  const FileUploader = ({ 
    title, 
    description, 
    state, 
    onUpload, 
    type 
  }: { 
    title: string;
    description: string;
    state: UploadState;
    onUpload: (file: File) => void;
    type: 'llm' | 'normal';
  }) => (
    <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
      <h3 className="text-2xl font-bold text-gray-900 mb-4">{title}</h3>
      <p className="text-gray-600 mb-6">{description}</p>
      
      <div
        className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-500 hover:bg-blue-50 transition-all duration-300 cursor-pointer"
        onClick={() => document.getElementById(`file-${type}`)?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const files = e.dataTransfer.files;
          if (files.length > 0) onUpload(files[0]);
        }}
      >
        <input
          id={`file-${type}`}
          type="file"
          accept=".pdf,.png,.jpg,.jpeg"
          className="hidden"
          onChange={(e) => {
            const files = e.target.files;
            if (files && files.length > 0) onUpload(files[0]);
          }}
        />
        
        {state.uploading ? (
          <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
        ) : (
          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        )}
        
        <p className="text-lg font-semibold text-gray-700 mb-2">
          {state.uploading ? 'Converting...' : 'Drop your file here or click to upload'}
        </p>
        <p className="text-sm text-gray-500">
          Supports PDF, PNG, JPG files up to 10MB
        </p>
        
        {state.file && (
          <p className="mt-4 text-sm text-blue-600 font-medium">
            Selected: {state.file.name}
          </p>
        )}
      </div>

      {state.error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700">{state.error}</p>
        </div>
      )}

      {state.result && (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center justify-between">
            <p className="text-green-700 font-medium">Conversion completed!</p>
            <button className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
              <Download className="w-4 h-4" />
              Download CSV
            </button>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                <FileSpreadsheet className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">DocConverter Pro</h1>
            </div>
            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium">
              Get Started
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Convert PDFs & Images to
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600"> Perfect CSV</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            The ultimate <strong>bank statement converter</strong> and <strong>PDF to Excel converter</strong>. 
            Handle scanned documents, handwritten text, and complex tables with perfect accuracy.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <button 
              onClick={() => document.querySelector('#upload-section')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-blue-600 text-white px-8 py-4 rounded-xl hover:bg-blue-700 transition-all duration-300 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Start Converting Now
            </button>
            <button className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-xl hover:border-blue-600 hover:text-blue-600 transition-all duration-300 font-semibold text-lg">
              View Demo
            </button>
          </div>

          {/* Trust Indicators */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">99.9%</div>
              <div className="text-sm text-gray-600">Accuracy Rate</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">10M+</div>
              <div className="text-sm text-gray-600">Files Processed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">50K+</div>
              <div className="text-sm text-gray-600">Happy Users</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">24/7</div>
              <div className="text-sm text-gray-600">Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* Upload Section */}
      <section id="upload-section" className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Choose Your Conversion Method</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Select the best processing method for your document type and accuracy requirements
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <FileUploader
              title="AI-Powered Conversion"
              description="Advanced AI for complex documents, handwritten text, and maximum accuracy. Perfect for bank statements and financial documents."
              state={llmUpload}
              onUpload={(file) => handleFileUpload(file, 'llm')}
              type="llm"
            />
            
            <FileUploader
              title="Fast Standard Conversion"
              description="Quick processing for standard documents and typed text. Ideal for invoices, receipts, and straightforward tables."
              state={normalUpload}
              onUpload={(file) => handleFileUpload(file, 'normal')}
              type="normal"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose DocConverter Pro?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The most advanced <strong>image to Excel converter</strong> with features that matter
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                <Target className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Perfect Numeric Accuracy</h3>
              <p className="text-gray-600 leading-relaxed">
                No rounding errors, misreads, or missing decimals. Critical for financial statements and precise data extraction.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-6">
                <FileText className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Handwritten Text Support</h3>
              <p className="text-gray-600 leading-relaxed">
                Advanced OCR technology handles scanned PDFs and even handwritten text with exceptional accuracy.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-6">
                <Shield className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Layout Preservation</h3>
              <p className="text-gray-600 leading-relaxed">
                Maintains column alignment and table relationships for perfect CSV/Excel output structure.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-6">
                <Zap className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Large Collections</h3>
              <p className="text-gray-600 leading-relaxed">
                Process multiple documents with varying formats, from short receipts to long financial statements.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mb-6">
                <Image className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Multi-Format Support</h3>
              <p className="text-gray-600 leading-relaxed">
                Works with contracts, receipts, invoices, bank statements, and other specialized document types.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
              <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-6">
                <Clock className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Lightning Fast</h3>
              <p className="text-gray-600 leading-relaxed">
                Quick processing times without compromising on accuracy. Get your Excel files in seconds.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Email Collection Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <Mail className="w-16 h-16 text-white mx-auto mb-6" />
            <h2 className="text-4xl font-bold text-white mb-4">Stay Updated</h2>
            <p className="text-xl text-blue-100 mb-8">
              Get notified about new features, tips for better conversions, and exclusive offers
            </p>
          </div>

          <form onSubmit={handleEmailSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              required
              className="flex-1 px-6 py-4 rounded-xl border-0 text-gray-900 placeholder-gray-500 focus:ring-4 focus:ring-white/20 outline-none text-lg"
            />
            <button
              type="submit"
              disabled={emailSubmitted}
              className="bg-white text-blue-600 px-8 py-4 rounded-xl hover:bg-gray-100 transition-all duration-300 font-semibold text-lg shadow-lg hover:shadow-xl disabled:opacity-50"
            >
              {emailSubmitted ? (
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5" />
                  Subscribed!
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  Subscribe
                  <ArrowRight className="w-5 h-5" />
                </div>
              )}
            </button>
          </form>

          <p className="text-sm text-blue-100 mt-4">
            No spam, unsubscribe at any time. We respect your privacy.
          </p>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Perfect for Every Use Case</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From personal finance to enterprise document processing
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              'Bank Statement to Excel Converter',
              'Invoice PDF to CSV',
              'Receipt Image to Excel',
              'Financial Report Converter',
              'Contract Data Extraction',
              'Tax Document Processing',
              'Expense Report Conversion',
              'Accounting Data Import'
            ].map((useCase, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
                  <Check className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900">{useCase}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                  <FileSpreadsheet className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold">DocConverter Pro</h3>
              </div>
              <p className="text-gray-400 leading-relaxed mb-6">
                The most advanced PDF to Excel converter and image to Excel converter. 
                Perfect for bank statement conversion and financial document processing.
              </p>
              <div className="flex gap-4">
                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors cursor-pointer">
                  <Users className="w-5 h-5" />
                </div>
                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors cursor-pointer">
                  <Mail className="w-5 h-5" />
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Features</h4>
              <ul className="space-y-2 text-gray-400">
                <li>PDF to CSV Converter</li>
                <li>Image to Excel</li>
                <li>Bank Statement Converter</li>
                <li>Handwritten Text OCR</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Help Center</li>
                <li>API Documentation</li>
                <li>Contact Support</li>
                <li>Privacy Policy</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2025 DocConverter Pro. All rights reserved. The ultimate PDF to Excel converter and bank statement to Excel converter.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;