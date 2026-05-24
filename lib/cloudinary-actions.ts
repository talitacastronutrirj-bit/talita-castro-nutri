"use server";

import { v2 as cloudinary } from "cloudinary";
import { getSession } from "@/lib/auth";

type SignaturePayload = {
  signature: string;
  timestamp: number;
  apiKey: string;
  cloudName: string;
  folder: string;
};

const BASE_FOLDER = "nogueiraporto";

function ensureConfig() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error(
      "Cloudinary não configurado. Defina CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY e CLOUDINARY_API_SECRET."
    );
  }
  return { cloudName, apiKey, apiSecret };
}

/**
 * Gera assinatura segura pra upload via cliente.
 * Só usuários autenticados (admin) podem solicitar.
 */
export async function getCloudinarySignature(
  context: "team" | "blog" | "hero" = "blog"
): Promise<SignaturePayload> {
  const session = await getSession();
  if (!session) {
    throw new Error("Sessão expirada. Faça login novamente.");
  }

  const { cloudName, apiKey, apiSecret } = ensureConfig();

  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  });

  const folder = `${BASE_FOLDER}/${context}`;
  const timestamp = Math.round(Date.now() / 1000);

  const signature = cloudinary.utils.api_sign_request(
    { timestamp, folder },
    apiSecret
  );

  return {
    signature,
    timestamp,
    apiKey,
    cloudName,
    folder,
  };
}
