import { StreamManager, Publisher } from 'openvidu-browser';
import { VideoType } from '../types/video-type';

/**
 * Packs all the information about the user
 */
export class UserModel {
	/**
	 * The Connection ID that is publishing the stream
	 */
	connectionId: string;

	/**
	 * The user nickname
	 */
	nickname: string;

	/**
	 * The user name in the server
	 */
	name: string;

	/**
	 * StreamManager object ([[Publisher]] or [[Subscriber]])
	 */
	streamManager: StreamManager;

	/**
	 * The position in the queue of people who are raising their hand (0 if not raising their hand)
	 */
	positionInHandRaiseQueue: number;

	/**
	 * Whether the user is speaking at the moment or not
	 */
	speaking: boolean;

	/**
	 * @hidden
	 */
	videoAvatar: HTMLCanvasElement;

	/**
	 * @hidden
	 */
	private randomAvatar: string;

	/**
	 * @hidden
	 */
	private videoSizeBig: boolean;

	/**
	 * @hidden
	 */
	constructor(connectionId?: string, streamManager?: StreamManager, nickname?: string, name?: string) {
		this.connectionId = connectionId || '';
		this.nickname = nickname || 'OpenVidu';
		this.streamManager = streamManager || null;
		this.name = name || this.nickname;
		this.positionInHandRaiseQueue = 0;
		this.speaking = false;
	}

	/**
	 * Return `true` if audio track is active and `false` if audio track is muted
	 */
	public isAudioActive(): boolean {
		// console.log("isAudioActive");
		return (<Publisher>this.streamManager)?.stream?.audioActive;
	}

	/**
	 * Return `true` if video track is active and `false` if video track is muted
	 */
	public isVideoActive(): boolean {
		// console.log("isVideoActive");
		return (<Publisher>this.streamManager)?.stream?.videoActive;
	}

	/**
	 * Return the connection ID
	 */
	public getConnectionId(): string {
		return this.streamManager?.stream?.connection?.connectionId || this.connectionId;
	}

	/**
	 * Return the user nickname
	 */
	public getNickname(): string {
		return this.nickname;
	}

	/**
	 * Return the server user name
	 */
	public getName(): string {
		return this.name;
	}

	/**
	 * Return the [[streamManger]] object
	 */
	public getStreamManager(): StreamManager {
		return this.streamManager;
	}

	/**
	 * Return the user avatar
	 */
	public getAvatar(): string {
		return this.videoAvatar ? this.videoAvatar.toDataURL() : this.randomAvatar;
	}

	/**
	 * Return the position in the queue of people who are raising their hand (0 if not raising their hand)
	 */
	public getPositionInHandRaiseQueue(): number {
		return this.positionInHandRaiseQueue;
	}

	/**
	 * Return whether the user is speaking at the moment or not
	 */
	public isSpeaking(): boolean {
		return this.speaking;
	}

	/**
	 * Return `true` if user has a local role and `false` if not
	 */
	public isLocal(): boolean {
		return !this.isRemote();
	}

	/**
	 * Return `true` if user has a remote role and `false` if not
	 */
	public isRemote(): boolean {
		return (<Publisher>this.streamManager)?.remote;
	}

	/**
	 * Return `true` if user has a screen role and `false` if not
	 */
	public isScreen(): boolean {
		// console.log("isScreen");
		return (<Publisher>this.streamManager)?.stream?.typeOfVideo === VideoType.SCREEN;
	}

	/**
	 * Return `true` if user has a camera role and `false` if not
	 */
	public isCamera(): boolean {
		// console.log("CCC");
		return (<Publisher>this.streamManager)?.stream?.typeOfVideo === VideoType.CAMERA || (this.isLocal() && !this.isScreen());
	}

	/**
	 * Set the connectionId
	 * @param connectionId value of connectionId
	 */
	public setConnectionId(connectionId: string) {
		this.connectionId = connectionId;
	}

	/**
	 * Set the streamManager value object
	 * @param streamManager value of streamManager
	 */
	public setStreamManager(streamManager: StreamManager) {
		this.streamManager = streamManager;
	}

	/**
	 * Set the user nickname value
	 * @param nickname value of user nickname
	 */
	public setNickname(nickname: string) {
		this.nickname = nickname;
	}

	/**
	 * Set the user name value
	 * @param name value of user name
	 */
	public setName(name: string) {
		this.name = name;
	}

	/**
	 * Set the position in the queue of people who are raising their hand
	 * @param positionInHandRaiseQueue value of the position
	 */
	public setPositionInHandRaiseQueue(positionInHandRaiseQueue: number) {
		this.positionInHandRaiseQueue = positionInHandRaiseQueue;
	}

	/**
	 * Set whether the user is speaking at the moment or not
	 * @param isSpeaking true if they are speaking, false otherwise
	 */
	public setIsSpeaking(isSpeaking: boolean) {
		this.speaking = isSpeaking;
	}

	public isVideoSizeBig(): boolean {
		return this.videoSizeBig;
	}

	/**
	 * @hidden
	 */
	public setVideoSizeBig(big: boolean) {
		this.videoSizeBig = big;
	}

	/**
	 * @hidden
	 */
	public setUserAvatar(img?: string): Promise<any> {
		return new Promise((resolve) => {
			if (!img) {
				this.createVideoAvatar();
				const video = <HTMLVideoElement>document.getElementById('video-' + this.getStreamManager().stream.streamId);
				const avatar = this.videoAvatar.getContext('2d');
				avatar.drawImage(video, 200, 120, 285, 285, 0, 0, 100, 100);
				resolve();
			} else {
				this.randomAvatar = img;
				resolve();
			}
		});
	}

	public removeVideoAvatar() {
		this.videoAvatar = null;
	}

	/**
	 * @hidden
	 */
	private createVideoAvatar() {
		this.videoAvatar = document.createElement('canvas');
		this.videoAvatar.className = 'user-img';
		this.videoAvatar.width = 100;
		this.videoAvatar.height = 100;
	}
}
