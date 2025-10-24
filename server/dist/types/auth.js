"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapProviderSlugToType = void 0;
const client_1 = require("@prisma/client");
const mapProviderSlugToType = (slug) => {
    switch (slug) {
        case 'google':
            return client_1.ProviderType.GOOGLE;
        case 'kakao':
            return client_1.ProviderType.KAKAO;
        case 'naver':
            return client_1.ProviderType.NAVER;
        case 'supabase':
            return client_1.ProviderType.SUPABASE;
        default:
            throw new Error(`Unsupported OAuth provider: ${slug}`);
    }
};
exports.mapProviderSlugToType = mapProviderSlugToType;
//# sourceMappingURL=auth.js.map