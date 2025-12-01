import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import { UsersComponent } from './users.component';
import { UserService } from '../core/services/user.service';
import { UserModel } from '../core/models/admin/user.model';
import { RequestOption } from '../shared/class/request-option';
import { finalize } from 'rxjs';
import { ResponseModel } from '../shared/models/response.model';

@Component({
  selector: 'app-users',
  standalone: true,
  templateUrl: './users.container.html',
  imports: [UsersComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class UsersContainerComponent implements OnInit {
  @ViewChild(UsersComponent)
  private readonly _childComponent: UsersComponent;

  private readonly _userService = inject(UserService);

  data = signal<UserModel[]>([]);
  loadingTable = signal<boolean>(false);

  ngOnInit(): void {
    this.toList();
  }

  toList(): void {
    this.loadingTable.set(true);
    this._userService
      .get(new RequestOption())
      .pipe(finalize(() => this.loadingTable.set(false)))
      .subscribe({
        next: (response: ResponseModel<UserModel[]>) => {
          if (response.success) {
            this.data.set(response.data);
          }
        },
      });
  }
}
