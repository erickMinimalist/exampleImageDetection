import { TestBed } from '@angular/core/testing';

import { ImageDetectionService } from './image-detection.service';

describe('ImageDetectionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ImageDetectionService = TestBed.get(ImageDetectionService);
    expect(service).toBeTruthy();
  });
});
