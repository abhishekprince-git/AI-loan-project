import pkg from 'agora-access-token';

const { RtcRole, RtcTokenBuilder } = pkg;

export function buildAgoraToken({ appId, appCertificate, channelName, uid, expiresIn }) {
  const currentTimestamp = Math.floor(Date.now() / 1000);
  const privilegeExpiredTs = currentTimestamp + expiresIn;

  return RtcTokenBuilder.buildTokenWithUid(
    appId,
    appCertificate,
    channelName,
    uid,
    RtcRole.PUBLISHER,
    privilegeExpiredTs
  );
}