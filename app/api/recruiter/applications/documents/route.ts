import { NextResponse } from 'next/server';
import { getServerSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { DeleteObjectCommand } from '@aws-sdk/client-s3';
import { s3 } from '@/lib/s3';

const VALID_DOC_TYPES = ['offerLetter', 'ndaDocument', 'joiningLetter', 'hrDocument'];

export async function POST(req: Request) {
  try {
    const decoded = getServerSession(req);
    if (!decoded || decoded.role !== 'RECRUITER') {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const { applicationId, documentType, fileUrl } = await req.json();

    if (!applicationId || !documentType || !fileUrl) {
      return NextResponse.json({ success: false, message: 'Missing fields' }, { status: 400 });
    }

    if (!VALID_DOC_TYPES.includes(documentType)) {
      return NextResponse.json({ success: false, message: 'Invalid document type' }, { status: 400 });
    }

    const application = await prisma.jobApplication.findUnique({
      where: { id: applicationId },
      include: { job: { include: { recruiter: true } } }
    });

    if (!application || application.job.recruiter.userId !== decoded.id) {
      return NextResponse.json({ success: false, message: 'Application not found or unauthorized' }, { status: 404 });
    }

    // Check if an existing document exists and delete it from S3
    const existingFileUrl = application[documentType as keyof typeof application] as string;
    if (existingFileUrl) {
      const bucketDomain = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/`;
      if (existingFileUrl.startsWith(bucketDomain)) {
        const secureKey = existingFileUrl.replace(bucketDomain, "");
        try {
          const command = new DeleteObjectCommand({
            Bucket: process.env.AWS_S3_BUCKET_NAME!,
            Key: secureKey,
          });
          await s3.send(command);
          console.log(`Deleted old document: ${secureKey}`);
        } catch (s3Err) {
          console.error("Failed to delete old document from S3:", s3Err);
          // Proceed with saving the new one even if delete fails
        }
      }
    }

    // Update Application
    await prisma.jobApplication.update({
      where: { id: applicationId },
      data: {
        [documentType]: fileUrl
      }
    });

    return NextResponse.json({ success: true, message: 'Document saved successfully' });
  } catch (error) {
    console.error('Save Document Error:', error);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
