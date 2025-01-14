@extends('admin.layout')

@section('content')
@include('admin.commons.flash-message')

<div class="container-fluid">
  <h4 class="c-grey-900 mT-10 mB-30">Users</h4>
  <div class="row">
    <div class="col-md-12">
      <div class="bgc-white bd bdrs-3 p-20 mB-20">
        <h4 class="c-grey-900 mB-20">Danh sach user</h4>

        <a class="btn btn-success" href="{{ route('admin.user.create') }}">Create user</a>

        <table id="dataTable" class="table table-striped table-bordered" cellspacing="0" width="100%">
            <thead>
              <tr>
                <th>ID</th>
                <th>Avatar</th>
                <th>Name</th>
                <th>Email</th>
                <th>Display name</th>
                <th>National</th>
                <th>Level</th>
                <th>Type</th>
                <th>status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tfoot>
              <tr>
                <th>ID</th>
                <th>Avatar</th>
                <th>Name</th>
                <th>Email</th>
                <th>Display name</th>
                <th>National</th>
                <th>Level</th>
                <th>Type</th>
                <th>status</th>
                <th>Action</th>
              </tr>
            </tfoot>
            <tbody>

                @foreach ($users as $user)

                  <tr>
                    <td>{{ $user->id }}</td>
                    <td><img src="{{ $user->profile?->avatar ? asset('storage/' . $user->profile->avatar) : asset('/Profile.png')}}"  class="coverImage" /></td>
                    <td>{{ $user->name }}</td>
                    <td>{{ $user->email }}</td>
                    <td>{{ $user->profile?->display_name ?? 'No name' }}</td>
                    <td>{{ $user->profile?->national?->name ?? 'No national' }}</td>
                    <td>{{ $user->profile?->level?->name ?? 'No level' }}</td>
                    <td>
                        @if($user->getUserTypeName() == 'SuperAdmin' )
                          <span class="text-danger fw-bold">SuperAdmin</span>
                        @elseif($user->getUserTypeName() == 'Admin')
                          <span class="text-primary fw-bold">Admin</span>
                        @else
                         <span class="fw-bold">Student</span>
                        @endif
                      
                    </td>
                    <td>{{ $user->getStatusName() }}</td>
                    <td>
                      <a class="btn cur-p btn-info btn-color" href="{{ route('admin.user.edit', $user->id) }}">Edit</a>
                      @if($user->isActive())
                        <a class="btn cur-p btn-danger btn-color" href="{{ route('admin.user.block-user', $user->id) }}" onclick="confirm('Are you sure?')">Block user</button>
                      @else
                        <a class="btn cur-p btn-info btn-color" href="{{ route('admin.user.unblock-user', $user->id) }}" onclick="confirm('Are you sure?')">Unblock user</button>
                      @endif
                    </td>
                  </tr>
                @endforeach
              
            </tbody>
          </table>
      </div>
    </div>
  </div>
</div>

@endsection
