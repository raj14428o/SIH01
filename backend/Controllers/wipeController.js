import crypto from 'crypto';
import WipeCertificate from '../models/WipeCertificate.js';

export const requestWipeSignature = async (req, res) => {
    const userId = req.user._id;
    const { certificateData } = req.body;

    if (!certificateData || typeof certificateData !== 'object') {
        return res.status(400).json({ error: 'Valid certificate data object is required.' });
    }

    try {
        const certificateHash = crypto
            .createHash('sha256')
            .update(JSON.stringify(certificateData))
            .digest('hex');

        const existingCert = await WipeCertificate.findOne({ certificateHash });
        if (existingCert) {
            return res.status(409).json({ error: 'This wipe event has already been certified.' });
        }

        // ✅ Validate that SIGNING_PRIVATE_KEY exists
        if (!process.env.SIGNING_PRIVATE_KEY) {
            console.error('SIGNING_PRIVATE_KEY is not set in the environment.');
            return res.status(500).json({ error: 'Server misconfiguration: private key missing.' });
        }

        const privateKey = process.env.SIGNING_PRIVATE_KEY.replace(/\\n/g, '\n');

        const signer = crypto.createSign('sha256');
        signer.update(certificateHash);
        const signature = signer.sign(privateKey, 'base64');

        const newCertificate = new WipeCertificate({
            user: userId,
            deviceSerial: certificateData.deviceSerial || 'N/A',
            certificateHash,
        });

        await newCertificate.save();

        res.status(201).json({
            message: 'Wipe certified successfully.',
            signature,
            certificateHash,
        });
    } catch (error) {
        console.error('Signature Request Error:', error);
        res.status(500).json({ error: 'Server error during signature request.' });
    }
};
