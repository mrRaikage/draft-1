import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { LocalStorageService } from '../../../shared/services/local-storage.service';
import { LogService } from '../../../shared/logger/services/log.service';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AssetModel } from '../../interfaces/asset.interface';

@Injectable({
  providedIn: 'root'
})
export class AssetApiService {
  path = environment.apiUrl + 'Asset';

  constructor(
    private http: HttpClient,
    private lSService: LocalStorageService,
    private logger: LogService
  ) { }

  getAsset(orgId: string): Observable<AssetModel[]> {
    this.logger.log('Service Call: Get Assets');
    return this.http.get<AssetModel[]>(
      this.path,
      { params: { OrgId: orgId } }
    ).pipe(tap(() => this.logger.log('Service Call Complete: Get Assets')));
  }

  editAsset(assetData: AssetModel, orgId: string): Observable<AssetModel> {
    this.logger.log('Service Call: Edit Assets');
    return this.http.put<AssetModel>(
      this.path,
      assetData,
      { params: { OrgId: orgId } }
    ).pipe(tap(() => this.logger.log('Service Call Complete: Edit Assets')));
  }
}
