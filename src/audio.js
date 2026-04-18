/**
 * audio.js — AudioManager for Zen Gomoku
 * Manages background music and sound effects with state focus.
 */

export const SFX = {
  STONE:   'assets/audio/stone_place.mp3',
  WIN:     'assets/audio/game_win.mp3',
  LOSS:    'assets/audio/game_loss.mp3',
  CLICK:   'assets/audio/ui_click.mp3',
  UI:      'assets/audio/ui_click.mp3',
  UNDO:    'assets/audio/ui_undo.mp3',
  INVALID: 'assets/audio/error.mp3'
};

const EXCLUSIVE_SFX = ['WIN', 'LOSS'];

export const MUSIC = 'assets/audio/zen_bgm.mp3';

class AudioManager {
  constructor() {
    this.music = new Audio(MUSIC);
    this.music.loop = true;
    this.targetMusicVolume = 0.2;
    this.sfxVolume = 0.5;
    this.muted = false;
    this.unlocked = false;
    this.isOutcomePlaying = false;
    this.activeOutcomeSound = null;

    this.music.volume = this.targetMusicVolume;
    this.fadeInterval = null;
  }

  /**
   * Browser autoplay policy requires user interaction.
   */
  unlock() {
    if (this.unlocked) return;
    this.unlocked = true;
    if (!this.muted && !this.isOutcomePlaying) {
      this.startMusic();
    }
  }

  startMusic() {
    if (this.muted || this.isOutcomePlaying) return;
    this.music.play().catch(() => {});
  }

  stopMusic() {
    this.music.pause();
  }

  /**
   * Smoothly fades out the music volume.
   */
  fadeOutMusic(duration = 1000) {
    if (this.fadeInterval) clearInterval(this.fadeInterval);
    
    const step = 0.05;
    const intervalTime = duration * step / this.music.volume;

    this.fadeInterval = setInterval(() => {
      if (this.music.volume > step) {
        this.music.volume -= step;
      } else {
        this.music.volume = 0;
        this.stopMusic();
        clearInterval(this.fadeInterval);
        this.fadeInterval = null;
      }
    }, intervalTime);
  }

  /**
   * Resumes ambient music, clearing any fade or outcome state.
   */
  resumeAmbient() {
    this.isOutcomePlaying = false;

    // Stop any playing outcome sound immediately
    if (this.activeOutcomeSound) {
      this.activeOutcomeSound.pause();
      this.activeOutcomeSound.currentTime = 0;
      this.activeOutcomeSound = null;
    }

    if (this.fadeInterval) {
      clearInterval(this.fadeInterval);
      this.fadeInterval = null;
    }
    this.music.volume = this.targetMusicVolume;
    if (!this.muted) {
      this.startMusic();
    }
  }

  playSfx(key) {
    if (this.muted) return;
    
    const upperKey = key.toUpperCase();
    const src = SFX[upperKey] || key;

    // Handle Exclusive Focus
    if (EXCLUSIVE_SFX.includes(upperKey)) {
      this.isOutcomePlaying = true;
      this.fadeOutMusic(500); // Quick fade

      // Stop previous outcome if it exists
      if (this.activeOutcomeSound) {
        this.activeOutcomeSound.pause();
        this.activeOutcomeSound.currentTime = 0;
      }
    }

    const audio = new Audio(src);
    audio.volume = this.sfxVolume;

    if (EXCLUSIVE_SFX.includes(upperKey)) {
      this.activeOutcomeSound = audio;
    }

    audio.play().catch(() => {});
  }

  setMuted(m) {
    this.muted = m;
    if (this.muted) {
      this.stopMusic();
    } else if (!this.isOutcomePlaying) {
      this.startMusic();
    }
  }

  toggleMute() {
    return this.setMuted(!this.muted);
  }
}

export const audioManager = new AudioManager();
