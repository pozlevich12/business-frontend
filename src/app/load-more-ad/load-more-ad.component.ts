import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AdExecutor } from '../common/ad/AdExecutor';
import { AdList } from '../common/ad/AdList';
import { AdExecuteLimit } from '../common/AdExecuteLimit';
import { LoadMoreAdService } from '../_services/load-more-ad.service';

@Component({
  selector: 'app-load-more-ad',
  templateUrl: './load-more-ad.component.html',
  styleUrls: ['./load-more-ad.component.scss']
})
export class LoadMoreAdComponent implements OnInit, OnDestroy {

  @Input() adExecutor!: AdExecutor;

  private subscriptionsLoadMoreAdService = new Subscription();

  private adExecuteLimit: AdExecuteLimit = new AdExecuteLimit(2, 0);
  private step: number = this.adExecuteLimit.limit;

  public allAdLoaded: boolean = true;
  public loading: boolean = true;

  constructor(private loadMoreAdService: LoadMoreAdService) { }

  ngOnInit(): void {
    this.subscribeToLoadAdMoreService();
  }


  public getNextAdExecuteLimit() {
    this.loadMoreAdService.setLoading(true);
    this.adExecutor.uploadNextAdList(this.adExecuteLimit)
      .then((adList: AdList[]) => {
        this.adExecutor.setAdList(this.adExecutor.getAdList().concat(adList));
        this.allAdLoaded = this.adExecuteLimit.limit - this.adExecuteLimit.offset > adList.length;
        if (!this.allAdLoaded) {
          this.adExecuteLimit.limit += this.step;
          this.adExecuteLimit.offset += this.step;
        }
      })
      .finally(() => this.loadMoreAdService.setLoading(false));
  }


  private updateConditionCallback() {
    this.allAdLoaded = true;
    window.scrollTo(0, 0);
    this.adExecutor.setAdList([]);
    this.adExecuteLimit = new AdExecuteLimit(2, 0);
    this.getNextAdExecuteLimit();
  }

  private subscribeToLoadAdMoreService() {

    this.subscriptionsLoadMoreAdService
      .add(this.loadMoreAdService.loading$.subscribe((loading$: boolean) => this.loading = loading$));
    this.subscriptionsLoadMoreAdService
      .add(this.loadMoreAdService.condition$.subscribe(() => this.updateConditionCallback()));
    console.log(this.subscriptionsLoadMoreAdService);
  }

  ngOnDestroy(): void {
    this.subscriptionsLoadMoreAdService.unsubscribe();
  }
}
