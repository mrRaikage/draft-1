import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

import { AssetApiService } from '../../services/api/asset-api.service';
import { LocalStorageService } from '../../../shared/services/local-storage.service';
import * as assetActions from './asset.actions';
import { AssetModel } from '../../interfaces/asset.interface';

@Injectable()
export class AssetEffects {

  constructor(
    private actions$: Actions,
    private router: Router,
    private assetApiService: AssetApiService,
    private lSService: LocalStorageService,
  ) {}

  /** Get Asset */
  assetData$ = createEffect(() => this.actions$.pipe(
    ofType(assetActions.assetData),
    switchMap(() => this.assetApiService.getAsset(this.lSService.getCurrentOrg().id)
      .pipe(
        map((data: AssetModel[]) => assetActions.assetDataSuccess({ data })),
        catchError((error) => of(assetActions.assetDataFailure()))
      )
    )
  ));

  /** Edit Asset */
  editAsset$ = createEffect(() => this.actions$.pipe(
    ofType(assetActions.editAsset),
    switchMap(({ data }) => this.assetApiService.editAsset(data, this.lSService.getCurrentOrg().id)
      .pipe(
        map((asset: AssetModel) => assetActions.editAssetSuccess({ asset })),
        catchError((error) => of(assetActions.editAssetFailure()))
      )
    )
  ));

  editAssetSuccess$ = createEffect(() => this.actions$.pipe(
    ofType(assetActions.editAssetSuccess),
    map(() => assetActions.assetData()))
  );
}
