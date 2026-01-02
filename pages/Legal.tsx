import React from 'react';

const Legal = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <div className="bg-swiss-surface border border-gray-800 rounded-2xl p-8 sm:p-12 shadow-xl">
        
        {/* Business Description (Stripe Requirement) */}
        <section className="mb-12 border-b border-gray-800 pb-8">
          <h1 className="text-3xl font-bold text-white mb-6">About SystemBetLab</h1>
          <p className="text-gray-300 text-lg leading-relaxed">
            SystemBetLab provides data analysis tools and software solutions for sports performance and event evaluation. 
            Our platform offers premium insights derived from manual curation and statistical modeling to assist disciplined investors in making informed decisions.
          </p>
        </section>

        {/* Impressum / Imprint */}
        <section className="mb-12 border-b border-gray-800 pb-8" id="imprint">
          <h2 className="text-2xl font-bold text-white mb-4">Impressum (Imprint)</h2>
          <div className="text-gray-400 space-y-2">
            <p><strong className="text-white">Company Name:</strong> SystemBetLab</p>
            <p><strong className="text-white">Address:</strong><br />
            Musterstrasse 123<br />
            8001 Zurich<br />
            Switzerland</p>
            
            <p className="mt-4"><strong className="text-white">Contact:</strong><br />
            Email: <a href="mailto:support@systembetlab.com" className="text-swiss-accent hover:underline">support@systembetlab.com</a></p>
            
            <p className="mt-4"><strong className="text-white">Represented by:</strong><br />
            Management Board</p>
          </div>
        </section>

        {/* Privacy Policy */}
        <section className="mb-12 border-b border-gray-800 pb-8" id="privacy">
          <h2 className="text-2xl font-bold text-white mb-4">Privacy Policy</h2>
          <div className="text-gray-400 space-y-4 text-sm leading-relaxed">
            <p>
              <strong>1. Data Collection</strong><br/>
              We collect information you provide directly to us, such as when you create an account, purchase credits, or request customer support. This may include your email address and payment history.
            </p>
            <p>
              <strong>2. Use of Data</strong><br/>
              We use your data to provide our services, process transactions via Stripe, and communicate with you about your account. We do not sell your personal data to third parties.
            </p>
            <p>
              <strong>3. Payments</strong><br/>
              Payment processing services are provided by Stripe. We do not store your full credit card details on our servers. The processing of payment data is subject to Stripe's Privacy Policy.
            </p>
            <p>
              <strong>4. Cookies</strong><br/>
              We use essential cookies to maintain your login session and ensure the security of our platform.
            </p>
          </div>
        </section>

        {/* Terms of Service */}
        <section id="terms">
          <h2 className="text-2xl font-bold text-white mb-4">Terms of Service</h2>
          <div className="text-gray-400 space-y-4 text-sm leading-relaxed">
            <p>
              <strong>1. Service Description</strong><br/>
              TipCredit (operated by SystemBetLab) sells credits that can be redeemed for information services (sports insights). Purchase of a credit does not guarantee a specific outcome or financial profit.
            </p>
            <p>
              <strong>2. Refund Policy</strong><br/>
              Due to the digital nature of the content (information), refunds are generally not provided once a credit has been redeemed and the information delivered. Refunds for unused credits may be requested via support.
            </p>
            <p>
              <strong>3. Age Restriction</strong><br/>
              You must be at least 18 years old to use this service.
            </p>
            <p>
              <strong>4. Disclaimer</strong><br/>
              All content is for informational and entertainment purposes only. SystemBetLab is not responsible for any financial losses incurred by acting on this information.
            </p>
          </div>
        </section>

      </div>
    </div>
  );
};

export default Legal;